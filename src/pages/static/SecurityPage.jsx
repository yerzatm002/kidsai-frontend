import React from "react";
import { Alert, Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";

export default function SecurityPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell title={t("pages.security.title")}>
      <Stack spacing={2}>
        <Typography sx={{ fontSize: 18, lineHeight: 1.6 }}>
          {t("pages.security.text")}
        </Typography>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          AI-помощник: не вводите номер телефона, email и другие персональные данные.
        </Alert>
      </Stack>
    </StaticPageShell>
  );
}