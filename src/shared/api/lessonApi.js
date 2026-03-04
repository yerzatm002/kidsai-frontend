import { apiClient } from "./apiClient";

// GET /api/topics/:id/lesson?lang=...
export async function getLessonByTopicId(topicId) {
  const res = await apiClient.get(`/api/topics/${topicId}/lesson`);
  return res.data; // { id, topicId, content, videoUrl, imageUrl, ... }
}