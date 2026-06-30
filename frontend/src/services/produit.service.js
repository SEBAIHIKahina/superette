import instance from "./api";

// Récupérer tous les produits
const getAll = () => instance.get("/produits");

// Récupérer uniquement les produits actifs
const getActive = () => instance.get("/produits/actifs");

// Récupérer un produit par son id
const get = (id) => instance.get(`/produits/${id}`);

// Ajouter un produit
const create = (data) => instance.post("/produits", data);

// Modifier un produit
const update = (id, data) =>
  instance.put(`/produits/${id}`, data);

// Désactiver un produit
const remove = (id) =>
  instance.delete(`/produits/${id}`);

// Réactiver un produit
const reactivate = (id) =>
  instance.put(`/produits/reactivate/${id}`);
const getByBarcode = (code) =>
  instance.get(`/produits/barcode/${code}`);

export default {
  getAll,
  getActive,
  get,
  create,
  update,
  remove,
  reactivate,
  getByBarcode,
};



// import instance from "./api";

// const getAll = () => instance.get("/produits");

// const create = (data) => instance.post("/produits", data);

// const update = (id, data) =>
//   instance.put(`/produits/${id}`, data);

// const remove = (id) =>
//   instance.delete(`/produits/${id}`);

// const getByBarcode = (code) =>
//   instance.get(`/produits/barcode/${code}`);

// export default {
//   getAll,
//   create,
//   update,
//   remove,
//   getByBarcode,
// };