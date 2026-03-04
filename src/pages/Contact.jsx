import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("nav.about")}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {t("placeholder.comingSoon")}
        </Typography>
      </CardContent>
    </Card>
  );
}