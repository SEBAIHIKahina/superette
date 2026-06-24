const categorieController = require("../controllers/categories.controller");
// const { authJwt } = require("../middelware");
// const { verifyToken, verifyRole } = authJwt;

module.exports = function (app) {
    // app.get("/api/categories/", [verifyToken, verifyRole(["Super Admin"])], categorieController.getAllCategories);
    // app.get("/api/categories/actives", [verifyToken, verifyRole(["Super Admin", "Admin Paie", "Directeur", "Chef-Service", "Employé","Admin Social"])], categorieController.getActiveCategories);//afficher les cat dans ajout rec soc tout emp sauf admin social
    app.post("/api/categories/", categorieController.createCategorie);//creer une cat superadmin
    // app.delete("/api/categories/:nom", [verifyToken, verifyRole(["Super Admin"])], categorieController.deleteCategorie);
    // app.put("/api/categories/:nom/reactivate", [verifyToken, verifyRole(["Super Admin"])], categorieController.reactivateCategorie);

}




