import React from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell
      title={t("pages.about.title")}
      subtitle={t("pages.about.subtitle")}
      icon={<AutoAwesomeIcon color="primary" />}
    >
      <Typography sx={{ fontSize: 18, lineHeight: 1.7 }}>
        {t("pages.about.text")}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2
        }}
      >
        <Card sx={{ borderRadius: 3, bgcolor: "rgba(47,128,237,0.05)" }}>
          <CardContent>
            <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon /> {t("pages.about.cards.1.title")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("pages.about.cards.1.text")}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, bgcolor: "rgba(242,153,74,0.08)" }}>
          <CardContent>
            <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
              <PsychologyIcon /> {t("pages.about.cards.2.title")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("pages.about.cards.2.text")}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, bgcolor: "rgba(39,174,96,0.08)" }}>
          <CardContent>
            <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesomeIcon /> {t("pages.about.cards.3.title")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("pages.about.cards.3.text")}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </StaticPageShell>
  );
}