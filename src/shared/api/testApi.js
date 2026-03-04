import { apiClient } from "./apiClient";

// GET /api/topics/:id/test?lang=...
export async function getTestByTopicId(topicId) {
  const res = await apiClient.get(`/api/topics/${topicId}/test`);
  return res.data; // { testId, topicId, title, questions:[{id,type,prompt,options:[]}] }
}

// POST /api/tests/:id/attempt
export async function submitTestAttempt(testId, answers) {
  const res = await apiClient.post(`/api/tests/${testId}/attempt`, { answers });
  return res.data; // { testId, score, maxScore, xpAwarded, bestTestScore, review:[] }
}