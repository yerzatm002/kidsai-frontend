import React from "react";
import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTranslation } from "react-i18next";

export default function BadgeCard({ badge }) {
  const { t } = useTranslation();
  const title = badge.title || badge.code;
  const date = badge.earnedAt ? new Date(badge.earnedAt).toLocaleString() : "—";

  return (
    <Card sx={{ bgcolor: "rgba(242,153,74,0.10)" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          <EmojiEventsIcon />
          <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
        </Stack>

        <Chip
          label={`${t("gami.earnedAt")}: ${date}`}
          size="small"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
}