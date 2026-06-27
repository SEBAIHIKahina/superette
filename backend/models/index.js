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
db.produits = require("./produit.model.js")(sequelize, Sequelize);
db.ventes = require("./vente.model.js")(sequelize, Sequelize);
db.detailVentes = require("./detailvente.model.js")(sequelize, Sequelize);

db.categories.hasMany(db.produits, {
  foreignKey: "categorieNom",
  sourceKey: "nom",
});

db.produits.belongsTo(db.categories, {
  foreignKey: "categorieNom",
  targetKey: "nom",
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

module.exports = db;