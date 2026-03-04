import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Chip,
  Button,
  Box
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

export default function XPGainDialog({
  open,
  onClose,
  xpAwarded = 0,
  level = null,
  xp = null,
  nextSteps = null // { lessonUrl, tasksUrl, testUrl }
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        {t("gami.xpGainedTitle")}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.5}>
          <Typography color="text.secondary">
            {t("gami.xpGainedText")}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip icon={<TrendingUpIcon />} label={`${t("gami.xp")}: +${xpAwarded}`} color="success" />
            {level != null ? (
              <Chip icon={<AutoAwesomeIcon />} label={`${t("gami.level")}: ${level}`} color="primary" />
            ) : null}
            {xp != null ? (
              <Chip label={`XP: ${xp}`} variant="outlined" />
            ) : null}
          </Stack>

          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontWeight: 900 }}>
              {t("gami.nextStepTitle")}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1 }}>
              {nextSteps?.lessonUrl ? (
                <Button component={RouterLink} to={nextSteps.lessonUrl} variant="outlined" fullWidth>
                  {t("gami.nextStepLesson")}
                </Button>
              ) : null}

              {nextSteps?.tasksUrl ? (
                <Button component={RouterLink} to={nextSteps.tasksUrl} variant="outlined" fullWidth>
                  {t("gami.nextStepTasks")}
                </Button>
              ) : null}

              {nextSteps?.testUrl ? (
                <Button component={RouterLink} to={nextSteps.testUrl} color="secondary" variant="contained" fullWidth>
                  {t("gami.nextStepTest")}
                </Button>
              ) : null}
            </Stack>
          </Box>

          <Button
            component={RouterLink}
            to="/badges"
            startIcon={<EmojiEventsIcon />}
            variant="text"
            sx={{ alignSelf: "flex-start" }}
          >
            {t("gami.openBadges")}
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} fullWidth>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}