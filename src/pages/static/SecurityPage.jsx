import React from "react";
import { Alert, Typography, Stack, Box, Card, CardContent } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import LockIcon from "@mui/icons-material/Lock";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { useTranslation } from "react-i18next";
import StaticPageShell from "./StaticPageShell";

export default function SecurityPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell
      title={t("pages.security.title")}
      subtitle={t("pages.security.subtitle")}
      icon={<ShieldIcon color="primary" />}
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: 18, lineHeight: 1.7 }}>
          {t("pages.security.text")}
        </Typography>

        <Alert severity="info" sx={{ borderRadius: 3 }}>
          {t("pages.security.alert")}
        </Alert>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2
          }}
        >
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
                <LockIcon /> {t("pages.security.cards.1.title")}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("pages.security.cards.1.text")}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
                <PrivacyTipIcon /> {t("pages.security.cards.2.title")}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("pages.security.cards.2.text")}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
                <ShieldIcon /> {t("pages.security.cards.3.title")}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t("pages.security.cards.3.text")}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </StaticPageShell>
  );
}