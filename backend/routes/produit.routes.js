const router = require("express").Router();
const produits = require("../controllers/produit.controller");

// Produits
router.get("/", produits.getAllProduits);
router.get("/actifs", produits.getActiveProduits);
router.get("/barcode/:code", produits.getByBarcode);
router.get("/:id", produits.findOne);

router.post("/", produits.create);
router.put("/:id", produits.update);

router.delete("/:id", produits.delete);
router.put("/reactivate/:id", produits.reactivate);

module.exports = router;




// const router = require("express").Router();
// const produits = require("../controllers/produit.controller");

// router.post("/", produits.create);
// router.get("/", produits.findAll);
// router.get("/:id", produits.findOne);
// router.put("/:id", produits.update);
// router.delete("/:id", produits.delete);

// module.exports = router;