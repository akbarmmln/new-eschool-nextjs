import axios from "axios";

const api = axios.create({
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
});

api.interceptors.request.use(async (config) => {
  if (!config.baseURL) {
    const { api } = await fetch("/api/config").then(r => r.json());
    config.baseURL = api;
  }

  return config;
});

export default api;