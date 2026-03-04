import { apiClient } from "./apiClient";

// 14) GET /api/me/progress
export async function getMyProgress() {
  const res = await apiClient.get("/api/me/progress");
  return res.data; // { items: [...] } :contentReference[oaicite:6]{index=6}
}

// 15) GET /api/me/dashboard
export async function getMyDashboard() {
  const res = await apiClient.get("/api/me/dashboard");
  return res.data; // { totalXp, level, badgesCount, completedTopics, chart:[...] } :contentReference[oaicite:7]{index=7}
}

// 16) GET /api/me/stats
export async function getMyStats() {
  const res = await apiClient.get("/api/me/stats");
  return res.data; // { totalXp, level } :contentReference[oaicite:8]{index=8}
}

// 17) GET /api/me/badges
export async function getMyBadges() {
  const res = await apiClient.get("/api/me/badges");
  return res.data; // { items:[{code,title,earnedAt}] } :contentReference[oaicite:9]{index=9}
}