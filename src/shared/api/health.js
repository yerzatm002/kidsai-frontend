import { apiClient } from "./apiClient";

export async function getHealth() {
  const res = await apiClient.get("/health");
  return res.data; // ожидаем { status: "ok" }
}