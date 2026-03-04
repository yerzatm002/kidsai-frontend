import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";

function toTextList(indices, options) {
  if (!Array.isArray(indices)) return "—";
  if (!Array.isArray(options)) return indices.join(", ");
  return indices.map((i) => options[i]).filter(Boolean).join("; ") || "—";
}

export default function ReviewCard({ questions, answersMap, reviewItem }) {
  const { t } = useTranslation();
  const q = questions.find((x) => x.id === reviewItem.questionId);
  if (!q) return null;

  const userSelected = answersMap[reviewItem.questionId] || [];
  const correctSelected = reviewItem.correctAnswer || [];

  const ok = !!reviewItem.correct;

  return (
    <Card sx={{ border: ok ? "2px solid rgba(39,174,96,0.35)" : "2px solid rgba(235,87,87,0.35)" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Chip
            icon={ok ? <CheckCircleIcon /> : <CancelIcon />}
            label={ok ? t("test.correct") : t("test.incorrect")}
            color={ok ? "success" : "error"}
            variant="outlined"
          />
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {q.prompt}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Typography sx={{ fontWeight: 800 }}>
          {t("test.yourAnswer")}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {toTextList(userSelected, q.options)}
        </Typography>

        <Typography sx={{ fontWeight: 800 }}>
          {t("test.correctAnswer")}
        </Typography>
        <Typography color="text.secondary">
          {toTextList(correctSelected, q.options)}
        </Typography>
      </CardContent>
    </Card>
  );
}