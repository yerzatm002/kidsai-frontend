import { apiClient } from "./apiClient";

export async function teacherCreateTopic(body) {
  const res = await apiClient.post("/api/teacher/topics", body);
  return res.data; // { topic: { id, orderIndex } } или похожее
}

export async function teacherPatchTopic(id, body) {
  const res = await apiClient.patch(`/api/teacher/topics/${id}`, body);
  return res.data;
}

export async function teacherCreateLesson(topicId, body) {
  const res = await apiClient.post(`/api/teacher/topics/${topicId}/lesson`, body);
  return res.data; // { lesson: { id, topicId } }
}

export async function teacherPatchLesson(lessonId, body) {
  const res = await apiClient.patch(`/api/teacher/lessons/${lessonId}`, body);
  return res.data;
}

export async function teacherCreateTasks(topicId, body) {
  const res = await apiClient.post(`/api/teacher/topics/${topicId}/tasks`, body);
  return res.data; // { created: n } или список
}

export async function teacherPatchTask(taskId, body) {
  const res = await apiClient.patch(`/api/teacher/tasks/${taskId}`, body);
  return res.data;
}

export async function teacherCreateTest(topicId, body) {
  const res = await apiClient.post(`/api/teacher/topics/${topicId}/test`, body);
  return res.data; // { test: { id, topicId } }
}

export async function teacherAddQuestions(testId, body) {
  const res = await apiClient.post(`/api/teacher/tests/${testId}/questions`, body);
  return res.data; // { created: n }
}

export async function teacherPatchQuestion(questionId, body) {
  const res = await apiClient.patch(`/api/teacher/questions/${questionId}`, body);
  return res.data;
}

export async function getSignedUpload(body) {
  const res = await apiClient.post("/api/files/signed-upload", body);
  return res.data; // { signedUrl, publicUrl, path }
}