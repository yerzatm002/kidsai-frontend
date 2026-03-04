import { apiClient } from "./apiClient";

// GET /api/topics?lang=kz|ru
export async function getTopics() {
  const res = await apiClient.get("/api/topics");
  return res.data; // ожидаем массив
}

// GET /api/topics/:id?lang=...
export async function getTopicById(id) {
  const res = await apiClient.get(`/api/topics/${id}`);
  return res.data;
}