import { apiClient } from "./apiClient";

// GET /api/teacher/students?grade=5
export async function teacherGetStudents({ grade } = {}) {
  const params = {};
  if (grade) params.grade = grade;
  const res = await apiClient.get("/api/teacher/students", { params });
  return res.data; // { items: [...] } или [...]
}

// GET /api/teacher/students/:id/progress
export async function teacherGetStudentProgress(studentId) {
  const res = await apiClient.get(`/api/teacher/students/${studentId}/progress`);
  return res.data; // { student, items:[{topicId, lessonViewed, tasksCompleted, bestTestScore, completedAt}] } или {items:[...]}
}