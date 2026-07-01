// const router = require("express").Router();
// const ventes = require("../controllers/vente.controller");

// router.post("/", ventes.create);
// router.get("/", ventes.findAll);
// router.get("/:id", ventes.findOne);

// module.exports = router;
const router = require("express").Router();

const controller = require("../controllers/vente.controller");

router.post("/", controller.create);

router.get("/", controller.findAll);

router.get("/:id", controller.findOne);

module.exports = router;