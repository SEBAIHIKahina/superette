const db = require("../models");

const Produit = db.produits;
const CodeBarre = db.codebarres;

exports.getActiveProduits = async (req, res) => {
  try {
    const produits = await Produit.findAll({
      where: { etat: true },
      include: [{ model: CodeBarre }],
      order: [["nom", "ASC"]],
    });

    res.json(produits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.findAll({
      include: [{ model: CodeBarre }],
      order: [["nom", "ASC"]],
    });

    const totalDesactives = await Produit.count({
      where: { etat: false },
    });

    res.json({
      produits,
      totalProduits: produits.length,
      totalDesactives,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      nom,
      prixVente,
      seuilAlerte,
      categorieNom,
      image,
      codesBarres,
    } = req.body;

    // Vérification
    if (!nom || !prixVente || !categorieNom) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Veuillez remplir les champs obligatoires.",
      });
    }

    // Produit existant ?
    const existingProduit = await Produit.findOne({
      where: { nom },
    });

    if (existingProduit) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Ce produit existe déjà.",
      });
    }

    // Création produit
    const produit = await Produit.create(
      {
        nom,
        prixVente,
        seuilAlerte,
        categorieNom,
        image,
      },
      { transaction }
    );

    // Création des codes-barres
    if (Array.isArray(codesBarres) && codesBarres.length > 0) {
      for (const code of codesBarres) {
        if (!code) continue;

        const existe = await CodeBarre.findOne({
          where: { code },
        });

        if (existe) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Le code-barres ${code} existe déjà.`,
          });
        }

        await CodeBarre.create(
          {
            code,
            produitId: produit.id,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    const produitComplet = await Produit.findByPk(produit.id, {
      include: [{ model: CodeBarre }],
    });

    res.status(201).json({
      message: "Produit ajouté avec succès.",
      produit: produitComplet,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de l'ajout du produit.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id, {
      include: [{ model: CodeBarre }],
    });

    if (!produit) {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    res.json(produit);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

exports.update = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      nom,
      prixVente,
      seuilAlerte,
      categorieNom,
      image,
      codesBarres,
    } = req.body;

    const produit = await Produit.findByPk(req.params.id);

    if (!produit) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    // Vérifier si un autre produit possède le même nom
    const existe = await Produit.findOne({
      where: { nom },
    });

    if (existe && existe.id != produit.id) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Ce produit existe déjà.",
      });
    }

    // Vérifier les nouveaux codes-barres
    if (Array.isArray(codesBarres)) {
      for (const code of codesBarres) {
        const codeExiste = await CodeBarre.findOne({
          where: { code },
        });

        if (codeExiste && codeExiste.produitId != produit.id) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Le code-barres ${code} existe déjà.`,
          });
        }
      }
    }

    // Mise à jour du produit
    await produit.update(
      {
        nom,
        prixVente,
        seuilAlerte,
        categorieNom,
        image,
      },
      { transaction }
    );

    // Supprimer les anciens codes
    await CodeBarre.destroy({
      where: {
        produitId: produit.id,
      },
      transaction,
    });

    // Ajouter les nouveaux
    if (Array.isArray(codesBarres)) {
      for (const code of codesBarres) {
        if (!code) continue;

        await CodeBarre.create(
          {
            code,
            produitId: produit.id,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    res.json({
      message: "Produit modifié avec succès.",
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la modification du produit.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);

    if (!produit) {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    await produit.update({
      etat: false,
    });

    res.json({
      message: "Produit désactivé avec succès.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

exports.reactivate = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);

    if (!produit) {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    await produit.update({
      etat: true,
    });

    res.json({
      message: "Produit réactivé avec succès.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};
exports.getByBarcode = async (req, res) => {
  try {
    const { code } = req.params;

    const codeBarre = await CodeBarre.findOne({
      where: { code },
      include: [
        {
          model: Produit,
          include: [CodeBarre],
        },
      ],
    });

    if (!codeBarre) {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    res.json(codeBarre.produit);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};



// const db = require("../models");
// const Produit = db.produits;

// // Ajouter un produit
// exports.create = async (req, res) => {
//   try {
//     const produit = await Produit.create(req.body);
//     res.status(201).json(produit);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Afficher tous les produits
// exports.findAll = async (req, res) => {
//   try {
//     const produits = await Produit.findAll();
//     console.log("Produits :", produits);
//     res.json(produits);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Afficher un produit par ID
// exports.findOne = async (req, res) => {
//   try {
//     const produit = await Produit.findByPk(req.params.id);

//     if (!produit) {
//       return res.status(404).json({
//         message: "Produit introuvable",
//       });
//     }

//     res.json(produit);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Modifier un produit
// exports.update = async (req, res) => {
//   try {
//     const id = req.params.id;

//     await Produit.update(req.body, {
//       where: { id },
//     });

//     res.json({
//       message: "Produit modifié avec succès",
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Supprimer un produit
// exports.delete = async (req, res) => {
//   try {
//     const id = req.params.id;

//     await Produit.destroy({
//       where: { id },
//     });

//     res.json({
//       message: "Produit supprimé avec succès",
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Rechercher par code-barres
// exports.findByBarcode = async (req, res) => {
//   try {
//     const produit = await Produit.findOne({
//       where: {
//         codeBarre: req.params.codeBarre,
//       },
//     });

//     if (!produit) {
//       return res.status(404).json({
//         message: "Produit non trouvé",
//       });
//     }

//     res.json(produit);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

