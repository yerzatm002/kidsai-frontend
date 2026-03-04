import React from "react";
import {
  Box, Card, CardContent, Typography, LinearProgress,
  Chip, Stack, Divider
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { TaskRenderer } from "./TaskRenderer";
import { submitTaskAttempt } from "../api/tasks";
import { RewardDialog } from "./RewardDialog";
import { useTranslation } from "react-i18next";

export function TaskPlayer({ topicId, tasks }) {
  const { t } = useTranslation();
  const [index, setIndex] = React.useState(0);
  const [attemptResult, setAttemptResult] = React.useState(null);
  const [rewardOpen, setRewardOpen] = React.useState(false);

  const task = tasks[index];
  const total = tasks.length;
  const progress = total ? Math.round(((index) / total) * 100) : 0;

  const onSubmit = async (answerPayload) => {
    // фронт не вычисляет correctness, доверяем только API-ответу :contentReference[oaicite:12]{index=12}
    const res = await submitTaskAttempt(task.id, answerPayload);
    setAttemptResult(res);
    setRewardOpen(true);
  };

  const onNext = () => {
    setRewardOpen(false);
    setAttemptResult(null);
    if (index < total - 1) setIndex((v) => v + 1);
  };

  if (!task) {
    return (
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {t("tasks.empty")}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Card sx={{ borderRadius: 4, mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip icon={<EmojiEventsIcon />} label={t("tasks.gamified")} color="primary" />
            <Chip label={`${t("tasks.task")} ${index + 1}/${total}`} />
          </Stack>

          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            {t("tasks.progress")}
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 99 }} />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            {task.prompt}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TaskRenderer task={task} onSubmit={onSubmit} />

        </CardContent>
      </Card>

      <RewardDialog
        open={rewardOpen}
        result={attemptResult}
        onClose={() => setRewardOpen(false)}
        onNext={onNext}
        isLast={index >= total - 1}
        topicId={topicId}
      />
    </Box>
  );
}