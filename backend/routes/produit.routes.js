const router = require("express").Router();
const produits = require("../controllers/produit.controller");

router.post("/", produits.create);
router.get("/", produits.findAll);
router.get("/:id", produits.findOne);
router.put("/:id", produits.update);
router.delete("/:id", produits.delete);

module.exports = router;