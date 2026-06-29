const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.categories = require("./categorie.model.js")(sequelize, Sequelize);
db.fournisseurs = require("./fournisseur.model.js")(sequelize, Sequelize);
db.achats = require("./achat.model.js")(sequelize, Sequelize);
db.lotStocks = require("./lotStock.model.js")(sequelize, Sequelize);
db.codebarres = require("./codeBarre.js")(sequelize, Sequelize);
db.produits = require("./produit.model.js")(sequelize, Sequelize);
db.ventes = require("./vente.model.js")(sequelize, Sequelize);
db.detailVentes = require("./detailvente.model.js")(sequelize, Sequelize);
db.parametres = require("./parametre.model.js")(sequelize, Sequelize);

db.categories.hasMany(db.produits, {
  foreignKey: "categorieNom",
  sourceKey: "nom",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

db.produits.belongsTo(db.categories, {
  foreignKey: "categorieNom",
  targetKey: "nom",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// =====================
// Vente -> Détail Vente
// =====================

db.ventes.hasMany(db.detailVentes, {
  foreignKey: "venteId",
});

db.detailVentes.belongsTo(db.ventes, {
  foreignKey: "venteId",
});

// =====================
// Produit -> Détail Vente
// =====================

db.produits.hasMany(db.detailVentes, {
  foreignKey: "produitId",
});
db.detailVentes.belongsTo(db.produits, {
  foreignKey: "produitId",
});

db.produits.hasMany(db.codebarres, {
  foreignKey: "produitId",
});

db.codebarres.belongsTo(db.produits, {
  foreignKey: "produitId",
});

//fournisseur achat
db.fournisseurs.hasMany(db.achats, {
  foreignKey: "fournisseurId",
});

db.achats.belongsTo(db.fournisseurs, {
  foreignKey: "fournisseurId",
});

// achat lotstock
db.achats.hasMany(db.lotStocks, {
  foreignKey: "achatId",
});

db.lotStocks.belongsTo(db.achats, {
  foreignKey: "achatId",
});
// produit lotStock
db.produits.hasMany(db.lotStocks, {
  foreignKey: "produitId",
});

db.lotStocks.belongsTo(db.produits, {
  foreignKey: "produitId",
});

//detailvente lotstock
db.lotStocks.hasMany(db.detailVentes, {
  foreignKey: "lotStockId",
});

db.detailVentes.belongsTo(db.lotStocks, {
  foreignKey: "lotStockId",
});

module.exports = db;