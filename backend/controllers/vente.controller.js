const db = require("../models");

const Vente = db.ventes;
const DetailVente = db.detailVentes;
const Produit = db.produits;

// =========================
// Enregistrer une vente
// =========================
exports.create = async (req, res) => {
  try {

    const { produits, modePaiement } = req.body;

    let total = 0;

    // Création de la vente
    const vente = await Vente.create({
      modePaiement,
      total: 0,
    });

    // Parcours des produits
    for (const item of produits) {

      const produit = await Produit.findByPk(item.produitId);

      if (!produit) {
        return res.status(404).json({
          message: "Produit introuvable",
        });
      }

      if (produit.stock < item.quantite) {
        return res.status(400).json({
          message: `${produit.nom} : stock insuffisant`,
        });
      }

      const sousTotal = produit.prixVente * item.quantite;

      total += sousTotal;

      // Enregistrer le détail
      await DetailVente.create({
        venteId: vente.id,
        produitId: produit.id,
        quantite: item.quantite,
        prixUnitaire: produit.prixVente,
        sousTotal,
      });

      // Mise à jour du stock
      produit.stock -= item.quantite;
      await produit.save();
    }

    // Mise à jour du total
    vente.total = total;
    await vente.save();

    res.status(201).json({
      message: "Vente enregistrée avec succès",
      vente,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }
};

// =========================
// Afficher toutes les ventes
// =========================
exports.findAll = async (req, res) => {

  try {

    const ventes = await Vente.findAll({

      include: [
        {
          model: DetailVente,
          include: [Produit],
        },
      ],

      order: [["id", "DESC"]],

    });

    res.json(ventes);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

};

// =========================
// Afficher une vente
// =========================
exports.findOne = async (req, res) => {

  try {

    const vente = await Vente.findByPk(req.params.id, {

      include: [
        {
          model: DetailVente,
          include: [Produit],
        },
      ],

    });

    if (!vente) {

      return res.status(404).json({
        message: "Vente introuvable",
      });

    }

    res.json(vente);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

};