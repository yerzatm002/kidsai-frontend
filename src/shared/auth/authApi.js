import { apiClient } from "../api/apiClient";

// POST /api/auth/register
export async function registerApi(payload) {
  const res = await apiClient.post("/api/auth/register", payload);
  return res.data;
}

// POST /api/auth/login
export async function loginApi(payload) {
  const res = await apiClient.post("/api/auth/login", payload);
  return res.data;
}

// POST /api/auth/refresh
export async function refreshApi(payload) {
  const res = await apiClient.post("/api/auth/refresh", payload);
  return res.data;
}

// GET /api/me
export async function meApi() {
  const res = await apiClient.get("/api/me");
  return res.data;
}