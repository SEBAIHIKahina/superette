// import instance from "./api";

// const create = (data) => instance.post("/ventes", data);

// const getAll = () => instance.get("/ventes");

// const getOne = (id) => instance.get(`/ventes/${id}`);

// export default {
//   create,
//   getAll,
//   getOne,
// };

import instance from "./api";

const getAll = () => instance.get("/ventes");

const getOne = (id) => instance.get(`/ventes/${id}`);

const create = (data) => instance.post("/ventes", data);

export default {
    getAll,
    getOne,
    create,
};