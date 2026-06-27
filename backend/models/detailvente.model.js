module.exports = (sequelize, Sequelize) => {

  const DetailVente = sequelize.define("detailventes", {

    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    quantite: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    prixUnitaire: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    sousTotal: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

  });

  return DetailVente;

};