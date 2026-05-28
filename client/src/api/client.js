import axios from "axios";

const API = axios.create({
  baseURL: "https://chat-at-gold.vercel.app/api",

});

export default API;