module.exports = (sequelize, Sequelize) => {
  const LotStock = sequelize.define("lot_stocks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    quantiteInitiale: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    quantiteRestante: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    prixAchat: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    dateExpiration: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
  });

  return LotStock;
};