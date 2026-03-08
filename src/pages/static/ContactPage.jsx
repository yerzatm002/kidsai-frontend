import React from "react";
import { Typography, Stack, Card, CardContent, Button, Box } from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EmailIcon from "@mui/icons-material/Email";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell
      title={t("pages.contact.title")}
      subtitle={t("pages.contact.subtitle")}
      icon={<ContactSupportIcon color="primary" />}
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: 18, lineHeight: 1.7 }}>
          {t("pages.contact.text")}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2
          }}
        >
          <Card sx={{ borderRadius: 3, bgcolor: "rgba(47,128,237,0.05)" }}>
            <CardContent>
              <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
                <FeedbackIcon /> {t("pages.contact.cards.1.title")}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("pages.contact.cards.1.text")}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, bgcolor: "rgba(242,153,74,0.08)" }}>
            <CardContent>
              <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon /> {t("pages.contact.cards.2.title")}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("pages.contact.cards.2.text")}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Typography color="text.secondary">
          {t("pages.contact.feedbackHint")}
        </Typography>

        <Button component={RouterLink} to="/courses" variant="outlined" sx={{ alignSelf: "flex-start" }}>
          {t("pages.contact.goToCourses")}
        </Button>
      </Stack>
    </StaticPageShell>
  );
}