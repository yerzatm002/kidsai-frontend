import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import XPGainDialog from "../../shared/ui/gamification/XPGainDialog";

export default function AttemptResultCard({ result }) {
  const { t } = useTranslation();
  const { id } = useParams(); // topicId из URL /topics/:id/tasks

  const correct = !!result.isCorrect;
  const xpAwarded = result.earnedXp ?? 0;
  const level = result.stats.level ?? null;
  const xp = result.stats.totalXp ?? null;

  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Card>
        <CardContent>
          <Alert severity={correct ? "success" : "warning"} sx={{ borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 900 }}>
              {correct ? t("tasks.correct") : t("tasks.incorrect")}
            </Typography>
          </Alert>

          <Typography variant="h6" sx={{ fontWeight: 900, mt: 2 }}>
            {t("tasks.reward")}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            <Chip label={`${t("tasks.xp")}: +${xpAwarded}`} color="success" />
            {level != null ? <Chip label={`${t("tasks.level")}: ${level}`} /> : null}
            {xp != null ? <Chip label={`XP: ${xp}`} /> : null}
          </Stack>
        </CardContent>
      </Card>

      <XPGainDialog
        open={open}
        onClose={() => setOpen(false)}
        xpAwarded={xpAwarded}
        level={level}
        xp={xp}
        nextSteps={{
          lessonUrl: `/topics/${id}/lesson`,
          tasksUrl: `/topics/${id}/tasks`,
          testUrl: `/topics/${id}/test`
        }}
      />
    </>
  );
}