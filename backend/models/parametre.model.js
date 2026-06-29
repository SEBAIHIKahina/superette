module.exports = (sequelize, Sequelize) => {
  const Parametre = sequelize.define("parametres", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    seuilAlerteExpiration: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 7,
    },
  });

  return Parametre;
};