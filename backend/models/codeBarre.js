module.exports = (sequelize, Sequelize) => {
  const CodeBarre = sequelize.define("code_barres", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    typeUnite: {
      type: Sequelize.ENUM("UNITE", "FARDEAU", "CARTON"),
      defaultValue: "UNITE",
    },
    
    actif: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return CodeBarre;
};