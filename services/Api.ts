import axios from "axios";

console.log(
  "BASE URL =",
  process.env.NEXT_PUBLIC_BASE_URL_API
);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
});

export default api;