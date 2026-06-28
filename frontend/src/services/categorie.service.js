import instance from "./api";

const createCategorie = (nom) => {
  return instance.post("/categories", { nom });
};

const CategorieService = {
  createCategorie,
};

export default CategorieService;