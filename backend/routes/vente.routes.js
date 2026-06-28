const router = require("express").Router();
const ventes = require("../controllers/vente.controller");

router.post("/", ventes.create);
router.get("/", ventes.findAll);
router.get("/:id", ventes.findOne);

module.exports = router;
