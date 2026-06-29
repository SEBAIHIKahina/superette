module.exports = (sequelize, Sequelize) => {
  const Produit = sequelize.define("produits", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nom: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    codeBarre: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    prixAchat: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    prixVente: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    stock: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    etat: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },

    categorieNom: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    seuilAlerte: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  });

  return Produit;
};