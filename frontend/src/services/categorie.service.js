import instance from "./api";

const createCategorie = (nom) => {
  return instance.post("/categories", { nom });
};

const getActive = () => instance.get("/categories/actives");

const CategorieService = {
  createCategorie,
  getActive,
};

export default CategorieService;

// import instance from "./api";

// const getAll = () => instance.get("/categories");

// const getActive = () => instance.get("/categories/actifs");

// const createCategorie = (data) =>
//   instance.post("/categories", data);

// const update = (nom, data) =>
//   instance.put(`/categories/${nom}`, data);

// const remove = (nom) =>
//   instance.delete(`/categories/${nom}`);

// const reactivate = (nom) =>
//   instance.put(`/categories/reactivate/${nom}`);

// export default {
//   getAll,
//   getActive,
//   createCategorie,
//   update,
//   remove,
//   reactivate,
// };