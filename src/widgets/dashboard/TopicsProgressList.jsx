import React from "react";
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Chip
} from "@mui/material";
import { useTranslation } from "react-i18next";

function calcProgress(item) {
  // Неформальная “оценка прогресса” для UX:
  // урок (40) + задания (до 40) + тест (до 20). Это НЕ “истина”, а визуальная мотивация.
  const lesson = item.lessonViewed ? 40 : 0;
  const tasks = Math.min(40, (item.tasksCompleted || 0) * 10);
  const test = Math.min(20, (item.bestTestScore || 0) * 2);
  return Math.min(100, lesson + tasks + test);
}

export default function TopicsProgressList({ items, topicsMap }) {
  const { t } = useTranslation();
  const list = Array.isArray(items) ? items : [];

  return (
    <Stack spacing={2}>
      {list.map((it) => {
        const title = topicsMap?.[it.topicId]?.title || it.topicId;
        const progress = calcProgress(it);

        return (
          <Box key={it.topicId} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(47,128,237,0.04)" }}>
            <Typography sx={{ fontWeight: 900 }}>
              {title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              <Chip
                label={`${t("dashboard.lessonViewed")}: ${it.lessonViewed ? "✅" : "—"}`}
                size="small"
              />
              <Chip
                label={`${t("dashboard.tasksCompleted")}: ${it.tasksCompleted ?? 0}`}
                size="small"
              />
              <Chip
                label={`${t("dashboard.bestTestScore")}: ${it.bestTestScore ?? 0}`}
                size="small"
              />
            </Stack>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1.5, height: 10, borderRadius: 999 }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}