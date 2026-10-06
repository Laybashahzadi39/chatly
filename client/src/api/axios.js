import axios from "axios";

// Ek jagah backend ka address set. Baar baar poora URL nahi likhna padega
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

// Har request bhejne se pehle ye chalega: token khud laga dega
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("chatUser"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;