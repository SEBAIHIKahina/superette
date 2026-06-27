module.exports = (app) => {

  const produits = require("../controllers/produit.controller");
  const router = require("express").Router();

  // Ajouter un produit
  router.post("/", produits.create);

  // Afficher tous les produits
  router.get("/", produits.findAll);

  // Rechercher par code-barres
  router.get("/barcode/:codeBarre", produits.findByBarcode);

  // Rechercher un produit par ID
  router.get("/:id", produits.findOne);

  // Modifier un produit
  router.put("/:id", produits.update);

  // Supprimer un produit
  router.delete("/:id", produits.delete);

  app.use("/api/produits", router);
};