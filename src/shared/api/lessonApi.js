import { apiClient } from "./apiClient";

// GET /api/topics/:id/lesson?lang=...
export async function getLessonByTopicId(topicId, lang) {
  const res = await apiClient.get(`/api/topics/${topicId}/lesson`, {
    params: { lang }
  });

  return res.data; // { id, content, imageUrl, videoUrl, ... }
}