import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import XPGainDialog from "../../shared/ui/gamification/XPGainDialog";

export default function TestResultCard({ result }) {
  const { t } = useTranslation();
  const { id } = useParams(); // topicId /topics/:id/test

  const score = result.score ?? 0;
  const maxScore = result.maxScore ?? 0;
  const xpAwarded = result.xpAwarded ?? 0;
  const best = result.bestTestScore ?? score;

  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Card>
        <CardContent>
          <Alert severity="success" sx={{ borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 900 }}>
              {t("test.resultTitle")}
            </Typography>
          </Alert>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            <Chip label={`${t("test.score")}: ${score} / ${maxScore}`} color="primary" />
            <Chip label={`${t("test.xpAwarded")}: +${xpAwarded}`} color="success" />
            <Chip label={`${t("test.bestScore")}: ${best}`} />
          </Stack>
        </CardContent>
      </Card>

      <XPGainDialog
        open={open}
        onClose={() => setOpen(false)}
        xpAwarded={xpAwarded}
        // после теста API часто не возвращает level/xp, поэтому оставляем null
        nextSteps={{
          lessonUrl: `/topics/${id}/lesson`,
          tasksUrl: `/topics/${id}/tasks`,
          testUrl: `/topics/${id}/test`
        }}
      />
    </>
  );
}