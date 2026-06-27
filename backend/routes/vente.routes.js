module.exports = (app) => {

  const ventes = require("../controllers/vente.controller");

  const router = require("express").Router();

  router.post("/", ventes.create);

  router.get("/", ventes.findAll);

  router.get("/:id", ventes.findOne);

  app.use("/api/ventes", router);

};