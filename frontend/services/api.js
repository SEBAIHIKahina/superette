import axios from "axios";
// import { getNavigator } from "../utilis/navigate";
// Crée une instance Axios
const instance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true // 🔥 essentiel pour envoyer les cookies avec chaque requête
});



export default instance;
