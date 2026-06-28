import instance from "./api";

const create = (data) => instance.post("/ventes", data);

const getAll = () => instance.get("/ventes");

const getOne = (id) => instance.get(`/ventes/${id}`);

export default {
  create,
  getAll,
  getOne,
};