import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Chip
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";

export function RewardDialog({ open, result, onClose, onNext, isLast }) {
  const { t } = useTranslation();

  const correct = !!result?.correct;
  const xp = result?.xpAwarded ?? 0;
  const level = result?.level ?? "-";
  const totalXp = result?.totalXp ?? "-";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 900 }}>
        {correct ? t("tasks.correctTitle") : t("tasks.incorrectTitle")}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.5}>
          <Chip
            icon={correct ? <CheckCircleIcon /> : <CancelIcon />}
            label={correct ? t("tasks.correct") : t("tasks.tryAgainNext")}
            color={correct ? "success" : "warning"}
          />
          <Chip icon={<StarIcon />} label={`${t("tasks.xpAwarded")}: +${xp}`} color="secondary" />
          <Typography sx={{ fontWeight: 800 }}>
            {t("tasks.levelNow")}: {level}
          </Typography>
          <Typography sx={{ opacity: 0.85 }}>
            {t("tasks.totalXp")}: {totalXp}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t("common.close")}
        </Button>
        <Button onClick={onNext} variant="contained">
          {isLast ? t("tasks.finish") : t("tasks.next")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}