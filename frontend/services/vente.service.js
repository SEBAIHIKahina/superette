import axios from "axios";

const API_URL = "http://localhost:5000/api/ventes";

const create = (data) => axios.post(API_URL, data);

const getAll = () => axios.get(API_URL);

const getOne = (id) => axios.get(`${API_URL}/${id}`);

export default {
  create,
  getAll,
  getOne,
};