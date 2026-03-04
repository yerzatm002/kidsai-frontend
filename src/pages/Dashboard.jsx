/* eslint-disable no-undef */
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  Skeleton,
  Alert
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useTranslation } from "react-i18next";
import { useLang } from "../shared/hooks/useLang";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";

import { getMyProgress, getMyDashboard, getMyStats, getMyBadges } from "../shared/api/dashboardApi";
import { getTopics } from "../shared/api/topicsApi"; // чтобы показать названия тем на текущем языке

import ProgressChart from "../widgets/dashboard/ProgressChart";
import BadgesGrid from "../widgets/dashboard/BadgesGrid";
import TopicsProgressList from "../widgets/dashboard/TopicsProgressList";

export default function Dashboard() {
  const { t } = useTranslation();
  const lang = useLang();
  const { notify } = useNotify();

  const [loading, setLoading] = React.useState(true);

  const [me, setMe] = React.useState(null);            // из вашего /api/me (контекст auth)
  const [stats, setStats] = React.useState(null);      // /api/me/stats
  const [dash, setDash] = React.useState(null);        // /api/me/dashboard
  const [progress, setProgress] = React.useState([]);  // /api/me/progress.items
  const [badges, setBadges] = React.useState([]);      // /api/me/badges.items
  const [topicsMap, setTopicsMap] = React.useState({}); // topicId -> {title,...}

  // ВАЖНО: здесь предполагается, что user из /api/me хранится в вашем auth store.
  // Если у вас есть useAuth(), просто возьмите me оттуда. Ниже — безопасный fallback:
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("kidsai_me");
      if (raw) setMe(JSON.parse(raw));
    // eslint-disable-next-line no-empty, no-unused-vars
    } catch (_) {}
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, dashData, progressData, badgesData, topicsData] = await Promise.all([
        getMyStats(),       // {totalXp, level} :contentReference[oaicite:12]{index=12}
        getMyDashboard(),   // агрегаты + chart :contentReference[oaicite:13]{index=13}
        getMyProgress(),    // items[] :contentReference[oaicite:14]{index=14}
        getMyBadges(),      // items[] :contentReference[oaicite:15]{index=15}
        getTopics()         // чтобы topicId -> title на текущем lang
      ]);

      setStats(statsData);
      setDash(dashData);
      setProgress(progressData?.items || []);
      setBadges(badgesData?.items || []);

      const items = topicsData?.items || topicsData || [];
      const map = {};
      (Array.isArray(items) ? items : []).forEach((tp) => { map[tp.id] = tp; });
      setTopicsMap(map);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setStats(null);
      setDash(null);
      setProgress([]);
      setBadges([]);
      setTopicsMap({});
    } finally {
      setLoading(false);
    }
  }, [notify]);

  React.useEffect(() => {
    load();
  }, [load, lang]);

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton height={44} width="50%" />
        <Skeleton variant="rounded" height={140} />
        <Skeleton variant="rounded" height={280} />
        <Skeleton variant="rounded" height={180} />
      </Stack>
    );
  }

  const totalXp = dash?.totalXp ?? stats?.totalXp ?? 0;
  const level = dash?.level ?? stats?.level ?? 1;
  const badgesCount = dash?.badgesCount ?? badges.length ?? 0;
  const completedTopics = dash?.completedTopics ?? 0;

  return (
    <Stack spacing={2.5}>
      {/* Профиль */}
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
            <Avatar
              sx={{ width: 72, height: 72, fontSize: 28, fontWeight: 900 }}
            >
              {(me?.fullName || "K")[0]?.toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {t("dashboard.title")}
              </Typography>
              <Typography color="text.secondary">
                {t("dashboard.subtitle")}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                <Chip icon={<AutoAwesomeIcon />} label={`${t("dashboard.level")}: ${level}`} />
                <Chip icon={<TrendingUpIcon />} label={`${t("dashboard.xp")}: ${totalXp}`} />
                <Chip icon={<EmojiEventsIcon />} label={`${t("dashboard.badges")}: ${badgesCount}`} />
                {me?.grade ? <Chip label={`${t("dashboard.grade")}: ${me.grade}`} /> : null}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Мотивирующие карточки (агрегаты) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              {t("dashboard.xp")}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {totalXp}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (totalXp % 100))} // лёгкий “визуальный рост”, не критичная логика
              sx={{ mt: 1.5, height: 10, borderRadius: 999 }}
            />
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              +XP за задания и тесты (геймификация в ТЗ) :contentReference[oaicite:16]{index=16}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              {t("dashboard.completedTopics")}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {completedTopics}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Видно, сколько тем реально закрыто (данные из /api/me/dashboard) :contentReference[oaicite:17]{index=17}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              {t("dashboard.badges")}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {badgesCount}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Бейджи — награды за достижения (ТЗ) :contentReference[oaicite:18]{index=18}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Диаграмма прогресса (не перегружаем) */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {t("dashboard.chartTitle")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Диаграмма строится из `dashboard.chart` :contentReference[oaicite:19]{index=19}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <ProgressChart chart={dash?.chart || []} topicsMap={topicsMap} />
          </Box>
        </CardContent>
      </Card>

      {/* Прогресс по темам списком */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {t("dashboard.progressByTopics")}
          </Typography>

          {progress.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2, borderRadius: 3 }}>
              {t("dashboard.noProgress")}
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <TopicsProgressList items={progress} topicsMap={topicsMap} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Бейджи */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {t("dashboard.badges")}
          </Typography>

          {badges.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2, borderRadius: 3 }}>
              {t("dashboard.noBadges")}
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <BadgesGrid items={badges} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}