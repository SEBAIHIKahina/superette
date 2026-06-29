const db = require("../models");

exports.getActiveFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await db.fournisseurs.findAll({
      where: { etat: true },
      order: [["nom", "ASC"]],
    });

    res.status(200).json(fournisseurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des fournisseurs.",
    });
  }
};


exports.getAllFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await db.fournisseurs.findAll({
      order: [["nom", "ASC"]],
    });

    const totalDesactives = await db.fournisseurs.count({
      where: { etat: false },
    });

    const totalUtilises = await db.achats.count({
      distinct: true,
      col: "fournisseurId",
    });

    res.status(200).json({
      fournisseurs,
      totalFournisseurs: fournisseurs.length,
      totalDesactives,
      totalUtilises,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des fournisseurs.",
    });
  }
};

exports.createFournisseur = async (req, res) => {
  const { nom, telephone, email, adresse } = req.body;

  try {
    if (!nom || !nom.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Le nom est obligatoire.",
      });
    }

    const fournisseur = await db.fournisseurs.findOne({
      where: { nom },
    });

    if (fournisseur) {
      if (!fournisseur.etat) {
        await fournisseur.update({
          telephone,
          email,
          adresse,
          etat: true,
        });

        return res.json({
          status: "reactivated",
          message: "Le fournisseur existait mais était désactivé.",
          fournisseur,
        });
      }

      return res.json({
        status: "exists",
        message: "Ce fournisseur existe déjà.",
      });
    }

    const nouveau = await db.fournisseurs.create({
      nom,
      telephone,
      email,
      adresse,
      etat: true,
    });

    res.status(201).json({
      status: "created",
      message: "Fournisseur ajouté avec succès.",
      fournisseur: nouveau,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de l'ajout du fournisseur.",
    });
  }
};

exports.updateFournisseur = async (req, res) => {
  const { id } = req.params;
  const { nom, telephone, email, adresse } = req.body;

  try {

    const fournisseur = await db.fournisseurs.findByPk(id);

    if (!fournisseur) {
      return res.status(404).json({
        message: "Fournisseur introuvable.",
      });
    }

    const existe = await db.fournisseurs.findOne({
      where: {
        nom,
        id: {
          [db.Sequelize.Op.ne]: id,
        },
      },
    });

    if (existe) {
      return res.status(400).json({
        message: "Un autre fournisseur possède déjà ce nom.",
      });
    }

    await fournisseur.update({
      nom,
      telephone,
      email,
      adresse,
    });

    res.json({
      message: "Fournisseur modifié avec succès.",
      fournisseur,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la modification.",
    });
  }
};

exports.deleteFournisseur = async (req, res) => {

  const { id } = req.params;

  try {

    const utilise = await db.achats.count({
      where: {
        fournisseurId: id,
      },
    });

    if (utilise > 0) {

      await db.fournisseurs.update(
        { etat: false },
        {
          where: { id },
        }
      );

      return res.json({
        message:
          "Le fournisseur est utilisé dans des achats. Il a été désactivé.",
      });
    }

    const deleted = await db.fournisseurs.destroy({
      where: { id },
    });

    if (deleted === 0) {
      return res.status(404).json({
        message: "Fournisseur introuvable.",
      });
    }

    res.json({
      message: "Fournisseur supprimé avec succès.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression.",
    });
  }
};

exports.reactivateFournisseur = async (req, res) => {

  const { id } = req.params;

  try {

    const [updated] = await db.fournisseurs.update(
      {
        etat: true,
      },
      {
        where: { id },
      }
    );

    if (updated === 0) {
      return res.status(404).json({
        message: "Fournisseur introuvable.",
      });
    }

    res.json({
      message: "Fournisseur réactivé avec succès.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la réactivation.",
    });
  }
};