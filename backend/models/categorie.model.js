module.exports = (sequelize, Sequelize) => {
    const categories = sequelize.define("categories", {
      nom: { type: Sequelize.STRING, primaryKey: true },
      etat: { type: Sequelize.BOOLEAN } ,
    });
  
    return categories;
  };