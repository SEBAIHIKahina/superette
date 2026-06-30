import instance from "./api";

const getAll = () => instance.get("/achats");

const getOne = (id) => instance.get(`/achats/${id}`);

const create = (data) => instance.post("/achats", data);

export default {
  getAll,
  getOne,
  create,
};