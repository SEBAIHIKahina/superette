const db = require("../models");

const Vente = db.ventes;
const DetailVente = db.detailVentes;
const Produit = db.produits;
const LotStock = db.lotStocks;

// ==============================
// CREATE VENTE (FIFO + STOCK)
// ==============================
exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { total, lignes } = req.body;

    if (!lignes || lignes.length === 0) {
      return res.status(400).json({ message: "Aucun produit dans la vente." });
    }

    // 1. Créer la vente
    const vente = await Vente.create(
      {
        total,
        dateVente: new Date(),
      },
      { transaction: t }
    );

    // 2. Parcourir les produits vendus
    for (const ligne of lignes) {
      let reste = ligne.quantite;

      // 3. Récupérer les lots FIFO (les plus anciens en premier)
      const lots = await LotStock.findAll({
        where: {
          produitId: ligne.produitId,
          quantiteRestante: { [db.Sequelize.Op.gt]: 0 },
        },
        order: [["id", "ASC"]],
        transaction: t,
      });

      for (const lot of lots) {
        if (reste <= 0) break;

        const dispo = lot.quantiteRestante;

        const aVendre = Math.min(dispo, reste);

        // diminuer lot
        lot.quantiteRestante -= aVendre;
        await lot.save({ transaction: t });

        // créer detail vente lié au lot
        await DetailVente.create(
          {
            venteId: vente.id,
            produitId: ligne.produitId,
            lotStockId: lot.id,
            quantite: aVendre,
            prixUnitaire: ligne.prixVente,
          },
          { transaction: t }
        );

        reste -= aVendre;
      }

      if (reste > 0) {
        throw new Error("Stock insuffisant pour un produit");
      }
    }

    await t.commit();

    return res.status(201).json({
      message: "Vente enregistrée avec succès",
      venteId: vente.id,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la vente",
      error: error.message,
    });
  }
};

// ==============================
// GET ALL VENTES
// ==============================
exports.findAll = async (req, res) => {
  try {
    const ventes = await Vente.findAll({
      include: [
        {
          model: DetailVente,
          include: [Produit],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(ventes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==============================
// GET ONE VENTE
// ==============================
exports.findOne = async (req, res) => {
  try {
    const vente = await Vente.findByPk(req.params.id, {
      include: [
        {
          model: DetailVente,
          include: [Produit, LotStock],
        },
      ],
    });

    if (!vente) {
      return res.status(404).json({ message: "Vente introuvable" });
    }

    res.json(vente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




// const db = require("../models");

// const Vente = db.ventes;
// const DetailVente = db.detailVentes;
// const Produit = db.produits;

// // =========================
// // Enregistrer une vente
// // =========================
// exports.create = async (req, res) => {
//   try {

//     const { produits, modePaiement } = req.body;

//     let total = 0;

//     // Création de la vente
//     const vente = await Vente.create({
//       modePaiement,
//       total: 0,
//     });

//     // Parcours des produits
//     for (const item of produits) {

//       const produit = await Produit.findByPk(item.produitId);

//       if (!produit) {
//         return res.status(404).json({
//           message: "Produit introuvable",
//         });
//       }

//       if (produit.stock < item.quantite) {
//         return res.status(400).json({
//           message: `${produit.nom} : stock insuffisant`,
//         });
//       }

//       const sousTotal = produit.prixVente * item.quantite;

//       total += sousTotal;

//       // Enregistrer le détail
//       await DetailVente.create({
//         venteId: vente.id,
//         produitId: produit.id,
//         quantite: item.quantite,
//         prixUnitaire: produit.prixVente,
//         sousTotal,
//       });

//       // Mise à jour du stock
//       produit.stock -= item.quantite;
//       await produit.save();
//     }

//     // Mise à jour du total
//     vente.total = total;
//     await vente.save();

//     res.status(201).json({
//       message: "Vente enregistrée avec succès",
//       vente,
//     });

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: err.message,
//     });

//   }
// };

// // =========================
// // Afficher toutes les ventes
// // =========================
// exports.findAll = async (req, res) => {

//   try {

//     const ventes = await Vente.findAll({

//       include: [
//         {
//           model: DetailVente,
//           include: [Produit],
//         },
//       ],

//       order: [["id", "DESC"]],

//     });

//     res.json(ventes);

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: err.message,
//     });

//   }

// };

// // =========================
// // Afficher une vente
// // =========================
// exports.findOne = async (req, res) => {

//   try {

//     const vente = await Vente.findByPk(req.params.id, {

//       include: [
//         {
//           model: DetailVente,
//           include: [Produit],
//         },
//       ],

//     });

//     if (!vente) {

//       return res.status(404).json({
//         message: "Vente introuvable",
//       });

//     }

//     res.json(vente);

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: err.message,
//     });

//   }

// };