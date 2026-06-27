const db = require("../models");
const Produit = db.produits;

// Ajouter un produit
exports.create = async (req, res) => {
  try {
    const produit = await Produit.create(req.body);
    res.status(201).json(produit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Afficher tous les produits
exports.findAll = async (req, res) => {
  try {
    const produits = await Produit.findAll();
    console.log("Produits :", produits);
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Afficher un produit par ID
exports.findOne = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);

    if (!produit) {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier un produit
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    await Produit.update(req.body, {
      where: { id },
    });

    res.json({
      message: "Produit modifié avec succès",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un produit
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Produit.destroy({
      where: { id },
    });

    res.json({
      message: "Produit supprimé avec succès",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rechercher par code-barres
exports.findByBarcode = async (req, res) => {
  try {
    const produit = await Produit.findOne({
      where: {
        codeBarre: req.params.codeBarre,
      },
    });

    if (!produit) {
      return res.status(404).json({
        message: "Produit non trouvé",
      });
    }

    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

