import React from "react";
import { Box, Typography, Skeleton, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";

import TopicCard from "../shared/ui/TopicCard";
import { getTopics } from "../shared/api/topicsApi";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";
import { useLang } from "../shared/hooks/useLang";

export default function Courses() {
  const { t } = useTranslation();
  const { notify } = useNotify();
  const lang = useLang(); // ожидаем "kz" | "ru"

  const [loading, setLoading] = React.useState(true);
  const [topics, setTopics] = React.useState([]);
  const [query, setQuery] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const items = await getTopics(lang);
      setTopics(items);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, [notify, lang]);

  React.useEffect(() => {
    load();
  }, [load]);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? topics.filter((tp) => (tp.title || "").toLowerCase().includes(normalized))
    : topics;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {t("courses.title")}
        </Typography>
        <Typography color="text.secondary">
          {t("courses.subtitle")}
        </Typography>
      </Box>

      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("courses.searchPlaceholder")}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />

      {loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 2
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i}>
              <Skeleton variant="rounded" height={240} />
            </Box>
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
          {filtered.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </Box>
      )}

      {!loading && filtered.length === 0 ? (
        <Typography color="text.secondary">
          {t("courses.empty")}
        </Typography>
      ) : null}
    </Stack>
  );
}