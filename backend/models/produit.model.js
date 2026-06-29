// id
// nom
// prixVente
// stockTotal
// stockMinimum
// categorieNom
// image

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
    seuilAlerte: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },

  });

  return Produit;
};