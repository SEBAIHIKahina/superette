import instance from "./api";

// Récupérer tous les fournisseurs
const getAll = () => instance.get("/fournisseurs");

// Récupérer les fournisseurs actifs
const getActive = () => instance.get("/fournisseurs/actifs");

// Ajouter un fournisseur
const create = (data) =>
  instance.post("/fournisseurs", data);

// Modifier un fournisseur
const update = (id, data) =>
  instance.put(`/fournisseurs/${id}`, data);

// Supprimer ou désactiver
const remove = (id) =>
  instance.delete(`/fournisseurs/${id}`);

// Réactiver
const reactivate = (id) =>
  instance.put(`/fournisseurs/reactiver/${id}`);

export default {
  getAll,
  getActive,
  create,
  update,
  remove,
  reactivate,
};