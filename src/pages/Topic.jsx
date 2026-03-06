import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Button,
  Skeleton
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ExtensionIcon from "@mui/icons-material/Extension";
import QuizIcon from "@mui/icons-material/Quiz";

import { getTopicById } from "../shared/api/topicsApi";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";

export default function Topic() {
  const { id } = useParams();
  const { notify } = useNotify();

  const [loading, setLoading] = React.useState(true);
  const [topic, setTopic] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTopicById(id);
      setTopic(data);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setTopic(null);
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  React.useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={220} />
        <Skeleton height={42} width="60%" />
        <Skeleton height={20} width="90%" />
        <Skeleton height={20} width="80%" />
        <Skeleton variant="rounded" height={120} />
      </Stack>
    );
  }

  if (!topic) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Тема не найдена
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Попробуйте вернуться в список курсов.
          </Typography>
          <Button component={RouterLink} to="/courses" sx={{ mt: 2 }}>
            К курсам
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Card sx={{ overflow: "hidden" }}>
        {topic.coverImageUrl ? (
          <CardMedia component="img" height="220" image={topic.coverImageUrl} alt={topic.title} />
        ) : null}

        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {topic.title}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {topic.description}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: 1.25,
              mt: 2.5
            }}
          >
            {/* Эти маршруты мы реализуем на следующих этапах. Сейчас это “готовые CTA” */}
            <Button
              component={RouterLink}
              to={`/topics/${id}/lesson`}
              startIcon={<MenuBookIcon />}
              fullWidth
            >
              Урок
            </Button>

            <Button
              component={RouterLink}
              to={`/topics/${id}/tasks`}
              variant="outlined"
              startIcon={<ExtensionIcon />}
              fullWidth
            >
              Задания
            </Button>

            <Button
              component={RouterLink}
              to={`/topics/${id}/test`}
              color="secondary"
              variant="outlined"
              startIcon={<QuizIcon />}
              fullWidth
            >
              Тест
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Как проходить тему?
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Сначала прочитай урок, потом сделай задания и в конце пройди тест. Так ты быстрее получишь XP и бейджи ✨
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}