import React from "react";
import { Box, Card, CardContent, Typography, Stack, Chip, Alert, LinearProgress } from "@mui/material";

function calcProgress(item) {
  // Лёгкая визуальная оценка "насколько тема пройдена":
  // урок (40) + задания (до 40) + тест (до 20)
  const lesson = item.lessonViewed ? 40 : 0;
  const tasks = Math.min(40, (Number(item.tasksCompleted || 0) * 10));
  const test = Math.min(20, (Number(item.bestTestScore || 0) * 2));
  return Math.min(100, lesson + tasks + test);
}

function statusLabel(item) {
  const p = calcProgress(item);
  if (p >= 85) return { label: "Прошёл", color: "success" };
  if (p >= 45) return { label: "В процессе", color: "warning" };
  return { label: "Отстаёт", color: "error" };
}

export default function StudentProgressCards({ items }) {
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: 3 }}>
        Прогресс пока не найден.
      </Alert>
    );
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
      {list.map((it, idx) => {
        const p = calcProgress(it);
        const st = statusLabel(it);

        return (
          <Card key={it.topicId || idx} sx={{ bgcolor: "rgba(47,128,237,0.04)" }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: 900 }}>
                  Тема: {it.topicTitle || it.topicId || `#${idx + 1}`}
                </Typography>
                <Chip label={st.label} color={st.color} size="small" />
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                <Chip label={`Урок: ${it.lessonViewed ? "✅" : "—"}`} size="small" />
                <Chip label={`Задания: ${it.tasksCompleted ?? 0}`} size="small" />
                <Chip label={`Лучший тест: ${it.bestTestScore ?? 0}`} size="small" />
              </Stack>

              <LinearProgress
                variant="determinate"
                value={p}
                sx={{ mt: 1.5, height: 10, borderRadius: 999 }}
              />

              {it.completedAt ? (
                <Typography color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>
                  Завершено: {new Date(it.completedAt).toLocaleString()}
                </Typography>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}