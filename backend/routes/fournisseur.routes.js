const router = require("express").Router();
const fournisseurs = require("../controllers/fournisseur.controller");

router.get("/", fournisseurs.getAllFournisseurs);

router.get("/actifs", fournisseurs.getActiveFournisseurs);

router.post("/", fournisseurs.createFournisseur);

router.put("/:id", fournisseurs.updateFournisseur);

router.delete("/:id", fournisseurs.deleteFournisseur);

router.put("/reactiver/:id", fournisseurs.reactivateFournisseur);

module.exports = router;