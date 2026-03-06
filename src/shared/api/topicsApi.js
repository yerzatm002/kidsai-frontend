import { apiClient } from "./apiClient";

// GET /api/topics?lang=kz|ru
export async function getTopics(lang) {
  const res = await apiClient.get("/api/topics", {
    params: { lang } // kz | ru
  });

  const data = res.data;
  // backend: { items: [...] }
  if (Array.isArray(data)) return data;
  return data?.items || [];
}

// GET /api/topics/:id?lang=...
export async function getTopicById(id, lang) {
  const res = await apiClient.get(`/api/topics/${id}`, { params: { lang } });
  return res.data;
}