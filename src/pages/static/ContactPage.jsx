import React from "react";
import { Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";
import FeedbackForm from "../../widgets/feedback/FeedbackForm";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell title={t("pages.contact.title")}>
      <Stack spacing={2}>
        <Typography sx={{ fontSize: 18, lineHeight: 1.6 }}>
          {t("pages.contact.text")}
        </Typography>

        {/* общий feedback без привязки к уроку: topicId можно передавать null,
           но API требует topicId, поэтому лучше показывать форму на страницах тем/уроков.
           Здесь оставим без формы или сделаем выбор темы. */}
        <Typography color="text.secondary">
          Лучше оставлять обратную связь на странице темы/урока, чтобы topicId был указан.
        </Typography>
      </Stack>
    </StaticPageShell>
  );
}