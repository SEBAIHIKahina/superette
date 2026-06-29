module.exports = (sequelize, Sequelize) => {
  const Fournisseur = sequelize.define("fournisseurs", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nom: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    telephone: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    adresse: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    etat: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return Fournisseur;
};