import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// ── Attach JWT on every request ──────────────────────────────
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ── Auto-logout on expired / invalid token ────────────────────
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;