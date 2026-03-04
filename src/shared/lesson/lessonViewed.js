export function getLessonViewedKey(topicId) {
  return `kidsai_lesson_viewed_${topicId}`;
}

export function isLessonViewed(topicId) {
  return localStorage.getItem(getLessonViewedKey(topicId)) === "1";
}

export function markLessonViewed(topicId) {
  localStorage.setItem(getLessonViewedKey(topicId), "1");
}