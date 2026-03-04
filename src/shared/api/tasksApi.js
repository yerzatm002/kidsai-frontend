import { apiClient } from "./apiClient";

// GET /api/topics/:id/tasks?lang=...
export async function getTasksByTopicId(topicId) {
  const res = await apiClient.get(`/api/topics/${topicId}/tasks`);
  return res.data; // ожидаем массив задач
}

// POST /api/tasks/:id/attempt
export async function submitTaskAttempt(taskId, answerPayload) {
  const res = await apiClient.post(`/api/tasks/${taskId}/attempt`, {
    answerPayload
  });
  return res.data; // { correct, xpAwarded, level, xp, ... }
}