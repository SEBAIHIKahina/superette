import axios from "axios";

const API_URL = "http://localhost:5000/api/produits";

const getAll = () => axios.get(API_URL);

const create = (data) => axios.post(API_URL, data);

const update = (id, data) => axios.put(`${API_URL}/${id}`, data);

const remove = (id) => axios.delete(`${API_URL}/${id}`);

const getByBarcode = (code) =>
  axios.get(`${API_URL}/barcode/${code}`);

export default {
  getAll,
  create,
  update,
  remove,
  getByBarcode,
};