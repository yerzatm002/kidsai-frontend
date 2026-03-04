import React from "react";
import { Box, Typography, Skeleton, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TopicCard from "../shared/ui/TopicCard";
import { getTopics } from "../shared/api/topicsApi";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";
import { useLang } from "../shared/hooks/useLang";


export default function Courses() {
  const { notify } = useNotify();
  const lang = useLang();
  const [loading, setLoading] = React.useState(true);
  const [topics, setTopics] = React.useState([]);
  const [query, setQuery] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTopics();
      setTopics(Array.isArray(data) ? data : []);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  React.useEffect(() => {
    load();
  }, [load, lang]);

  // чтобы при смене языка данные обновлялись:
  // i18n меняет язык → apiClient начинает слать другой lang,
  // но нам нужно перезапросить темы.
  // Самый простой способ: слушать storage event + i18n event — но без усложнения:
  // перезагрузка при фокусе вкладки (дружелюбно и стабильно)
  React.useEffect(() => {
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? topics.filter((t) => (t.title || "").toLowerCase().includes(normalized))
    : topics;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Курсы
        </Typography>
        <Typography color="text.secondary">
          Выберите тему и начните обучение
        </Typography>
      </Box>

      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по названию темы"
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
          Ничего не найдено. Попробуйте другой запрос.
        </Typography>
      ) : null}
    </Stack>
  );
}