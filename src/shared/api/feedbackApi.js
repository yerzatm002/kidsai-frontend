import { apiClient } from "./apiClient";

/**
 * POST /api/feedback
 * Headers: Authorization Bearer
 * Body: { topicId, lessonId, rating, message }
 * Ответ 201: { feedback: { id, status, createdAt } }
 */
export async function createFeedback(body) {
  const res = await apiClient.post("/api/feedback", body);
  return res.data;
}

/**
 * GET /api/teacher/feedback?page=1&pageSize=20
 * Ответ 200: { page, pageSize, total, items:[...] }
 */
export async function teacherGetFeedback({ page = 1, pageSize = 20 } = {}) {
  const res = await apiClient.get("/api/teacher/feedback", {
    params: { page, pageSize }
  });
  return res.data;
}