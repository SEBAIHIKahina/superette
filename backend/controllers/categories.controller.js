const db = require("../models");
exports.createCategorie = async (req, res) => {

  const { nom } = req.body;

  try {
    if (!nom?.trim()) {
      return res.status(400).json({ status: "error", message: "Le nom de la catégorie est requis." });
    }

    const existing = await db.categories.findOne({ where: { nom } });

    if (existing) {
      if (!existing.etat) {
        await db.categories.update({ etat: true }, { where: { nom } });

        // Recharger la catégorie avec l'auteur
        const updatedCategorie = await db.categories.findOne({
          where: { nom },
        });

        return res.json({
          status: "reactivated",
          message: "Catégorie existante mais désactivée, elle est maintenant réactivée.",
          categorie: updatedCategorie
        });
      } else {
        return res.json({ status: "exists", message: "Cette catégorie existe déjà." });
      }
    }

    // Création
    await db.categories.create({ nom, etat: true });

    // Recharger avec l'auteur inclus
    const fullCategorie = await db.categories.findOne({
      where: { nom }
    });

    res.status(201).json({
      status: "created",
      message: "Catégorie ajoutée avec succès.",
      categorie: fullCategorie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Erreur lors de l'ajout de la catégorie." });
  }
};
exports.getActiveCategories = async (req, res) => {
  try {
    // Récupérer uniquement les catégories avec l'état `true` (actives)
    const activeCategories = await db.categories.findAll({
      where: { etat: true }
    });

    res.status(200).json(activeCategories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories actives :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};