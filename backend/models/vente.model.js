module.exports = (sequelize, Sequelize) => {

  const Vente = sequelize.define("ventes", {

    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    dateVente: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },

    total: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    modePaiement: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Espèces",
    },

  });

  return Vente;

};