import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <StaticPageShell title={t("pages.about.title")}>
      <Typography sx={{ fontSize: 18, lineHeight: 1.6 }}>
        {t("pages.about.text")}
      </Typography>
    </StaticPageShell>
  );
}