const db = require("../models");

const Achat = db.achats;
const LotStock = db.lotStocks;
const Produit = db.produits;
const Fournisseur = db.fournisseurs;

exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { fournisseurId, remarque, lots } = req.body;

    if (!fournisseurId) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Veuillez sélectionner un fournisseur.",
      });
    }

    if (!Array.isArray(lots) || lots.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Aucun produit à acheter.",
      });
    }

    let montantTotal = 0;

    const achat = await Achat.create(
      {
        fournisseurId,
        remarque,
        montantTotal: 0,
      },
      { transaction }
    );

    for (const item of lots) {
      const {
        produitId,
        quantite,
        prixAchat,
        dateExpiration,
      } = item;

      const produit = await Produit.findByPk(produitId, {
        transaction,
      });

      if (!produit) {
        throw new Error("Produit introuvable.");
      }

      await LotStock.create(
        {
          achatId: achat.id,
          produitId,
          quantiteInitiale: quantite,
          quantiteRestante: quantite,
          prixAchat,
          dateExpiration: dateExpiration || null,
        },
        { transaction }
      );

      await produit.update(
        {
          stock: produit.stock + Number(quantite),
        },
        { transaction }
      );

      montantTotal += Number(prixAchat) * Number(quantite);
    }

    await achat.update(
      {
        montantTotal,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Achat enregistré avec succès.",
      achat,
    });

  } catch (error) {

    await transaction.rollback();

    console.error(error);

    res.status(500).json({
      message: "Erreur lors de l'enregistrement de l'achat.",
    });

  }
};

exports.getAll = async (req, res) => {

  try {

    const achats = await Achat.findAll({
      include: [
        {
          model: Fournisseur,
        },
        {
          model: LotStock,
          as: "lots",
          include: [
            {
              model: Produit,
            },
          ],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json(achats);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Erreur serveur.",
    });

  }

};

exports.findOne = async (req, res) => {

  try {

    const achat = await Achat.findByPk(req.params.id, {
      include: [
        {
          model: Fournisseur,
        },
        {
          model: LotStock,
          as: "lots",
          include: [
            {
              model: Produit,
            },
          ],
        },
      ],
    });

    if (!achat) {
      return res.status(404).json({
        message: "Achat introuvable.",
      });
    }

    res.json(achat);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Erreur serveur.",
    });

  }

};