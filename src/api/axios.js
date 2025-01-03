import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Cambia esta URL según tu entorno
});

export default API;
