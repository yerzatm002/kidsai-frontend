import React from "react";
import { Box, Card, CardContent, Typography, Stack, Button, Skeleton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useTranslation } from "react-i18next";

import TopicCard from "../shared/ui/TopicCard";
import { getTopics } from "../shared/api/topicsApi";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";
import { useLang } from "../shared/hooks/useLang";

export default function Home() {
  const { t } = useTranslation();
  const { notify } = useNotify();
  const lang = useLang();

  const [loading, setLoading] = React.useState(true);
  const [topics, setTopics] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getTopics(lang);
        setTopics(Array.isArray(data) ? data : []);
      } catch (e) {
        const err = normalizeApiError(e);
        notify(err.message, "error");
        setTopics([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [notify, lang]);

  const top3 = topics.slice(0, 3);

  return (
    <Stack spacing={2.5}>
      {/* Hero */}
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("home.heroTitle")}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t("home.heroSubtitle")}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2.5 }}>
            <Button component={RouterLink} to="/courses" startIcon={<AutoAwesomeIcon />}>
              {t("home.startLearning")}
            </Button>

            <Button component={RouterLink} to="/faq" variant="outlined">
              {t("home.howItWorks")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* What / For whom */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2
        }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}
            >
              <SchoolIcon /> {t("home.forWhomTitle")}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("home.forWhomText")}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}
            >
              <TipsAndUpdatesIcon /> {t("home.whatIsAiTitle")}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("home.whatIsAiText")}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}
            >
              <AutoAwesomeIcon /> {t("home.howWeLearnTitle")}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("home.howWeLearnText")}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Topics preview */}
      <Stack spacing={1.25}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("home.popularTopics")}
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 2
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={240} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 2
            }}
          >
            {top3.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </Box>
        )}

        <Box>
          <Button component={RouterLink} to="/courses" variant="outlined">
            {t("home.viewAllTopics")}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}