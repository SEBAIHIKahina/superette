const router = require("express").Router();
const achats = require("../controllers/achat.controller");

router.post("/", achats.create);
router.get("/", achats.getAll);
router.get("/:id", achats.findOne);

module.exports = router;