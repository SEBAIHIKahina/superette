import instance from "./api";

const getAll = () => instance.get("/produits");

const create = (data) => instance.post("/produits", data);

const update = (id, data) =>
  instance.put(`/produits/${id}`, data);

const remove = (id) =>
  instance.delete(`/produits/${id}`);

const getByBarcode = (code) =>
  instance.get(`/produits/barcode/${code}`);

export default {
  getAll,
  create,
  update,
  remove,
  getByBarcode,
};