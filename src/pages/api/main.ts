import axios from "axios";

const api = axios.create({
  baseURL: "https://instagramserverapi.herokuapp.com/",
});

export default api;