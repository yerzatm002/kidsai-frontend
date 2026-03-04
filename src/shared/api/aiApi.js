import { apiClient } from "./apiClient";

/**
 * POST /api/ai/help (Authorization обязателен)
 * Body: { topicId, mode, lang, question, lessonSnippet }
 * Ответ: { answer, blocked, fallback? }
 */
export async function aiHelp(body) {
  const res = await apiClient.post("/api/ai/help", body);
  return res.data;
}