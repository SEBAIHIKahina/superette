module.exports = (sequelize, Sequelize) => {
  const Achat = sequelize.define("achats", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    montantTotal: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    remarque: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return Achat;
};