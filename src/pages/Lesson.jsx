import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Button,
  Skeleton,
  Alert,
  Divider
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AiFloatingWidget from "../widgets/ai/AiFloatingWidget";
import FeedbackForm from "../widgets/feedback/FeedbackForm";

import { useTranslation } from "react-i18next";
import { useLang } from "../shared/hooks/useLang";
import { getLessonByTopicId } from "../shared/api/lessonApi";
import { getTopicById } from "../shared/api/topicsApi";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";
import { isLessonViewed, markLessonViewed } from "../shared/lesson/lessonViewed";

export default function Lesson() {
  const { id } = useParams(); // topicId
  const { t } = useTranslation();
  const lang = useLang(); // чтобы урок перезагружался при смене языка
  const { notify } = useNotify();
    // topicId из params
  // lesson.content — HTML
  // сделайте snippet из текста (без HTML), чтобы не отправлять “лишнее”
  const lessonSnippet = React.useMemo(() => {
    // примитивно: убрать теги
  const plain = String(lesson?.content || "").replace(/<[^>]+>/g, " ");
    return plain.slice(0, 700);
  }, [lesson?.content]);
  const [loading, setLoading] = React.useState(true);
  const [topic, setTopic] = React.useState(null);
  const [lesson, setLesson] = React.useState(null);
  const [viewed, setViewed] = React.useState(isLessonViewed(id));

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      // параллельно подгружаем тему и урок
      const [topicData, lessonData] = await Promise.all([
        getTopicById(id),
        getLessonByTopicId(id)
      ]);
      setTopic(topicData);
      setLesson(lessonData);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setTopic(null);
      setLesson(null);
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  React.useEffect(() => {
    load();
  }, [load, lang]);

  const safeHtml = React.useMemo(() => {
    const raw = lesson?.content || "";
    // Разрешаем базовую разметку (заголовки/списки/ссылки/таблицы),
    // запрещаем скрипты и опасные атрибуты.
    return DOMPurify.sanitize(raw, {
      USE_PROFILES: { html: true }
    });
  }, [lesson]);

  const onMarkViewed = () => {
    markLessonViewed(id);
    setViewed(true);
    notify(t("lesson.readMarked"), "success");
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={220} />
        <Skeleton height={44} width="70%" />
        <Skeleton height={22} width="90%" />
        <Skeleton height={22} width="80%" />
        <Skeleton variant="rounded" height={280} />
      </Stack>
    );
  }

  if (!lesson) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {t("lesson.title")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Урок недоступен.
          </Typography>
          <Button
            component={RouterLink}
            to={`/topics/${id}`}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            {t("lesson.backToTopic")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5}>
      <AiFloatingWidget
        topicId={id}
        lessonSnippet={lessonSnippet}
      />
      {/* Верхняя карточка: тема + кнопки */}
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              {t("lesson.title")}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {topic?.title || "—"}
            </Typography>
            {topic?.description ? (
              <Typography color="text.secondary">{topic.description}</Typography>
            ) : null}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 1.5 }}>
              <Button
                component={RouterLink}
                to={`/topics/${id}`}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
              >
                {t("lesson.backToTopic")}
              </Button>

              <Button
                onClick={onMarkViewed}
                color={viewed ? "success" : "primary"}
                startIcon={<CheckCircleIcon />}
                disabled={viewed}
              >
                {viewed ? t("lesson.readMarked") : t("lesson.readMark")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Иллюстрация */}
      {lesson.imageUrl ? (
        <Card sx={{ overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="260"
            image={lesson.imageUrl}
            alt={t("lesson.image")}
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
        </Card>
      ) : null}

      {/* Видео */}
      {lesson.videoUrl ? (
        <Alert
          icon={<PlayCircleIcon />}
          severity="info"
          sx={{ borderRadius: 3 }}
          action={
            <Button
              component="a"
              href={lesson.videoUrl}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              color="secondary"
              size="small"
            >
              {t("lesson.openVideo")}
            </Button>
          }
        >
          <Typography sx={{ fontWeight: 800 }}>{t("lesson.video")}</Typography>
          <Typography variant="body2" color="text.secondary">
            Посмотри видео — так будет легче понять тему.
          </Typography>
        </Alert>
      ) : null}

      {/* Контент урока (HTML) */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            {t("lesson.title")}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            className="kidsai-lesson-content"
            sx={{
              "& h1, & h2, & h3": {
                fontWeight: 900,
                lineHeight: 1.2,
                mt: 2,
                mb: 1
              },
              "& h1": { fontSize: { xs: "1.4rem", md: "1.7rem" } },
              "& h2": { fontSize: { xs: "1.25rem", md: "1.5rem" } },
              "& h3": { fontSize: { xs: "1.1rem", md: "1.25rem" } },
              "& p": {
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.7,
                mt: 1,
                mb: 1
              },
              "& ul, & ol": {
                pl: 3,
                mt: 1,
                mb: 1
              },
              "& li": {
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.7,
                mb: 0.5
              },
              "& a": {
                color: "primary.main",
                fontWeight: 800
              },
              "& blockquote": {
                m: 0,
                mt: 2,
                mb: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(47,128,237,0.08)"
              },
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                mt: 2,
                mb: 2
              },
              "& th, & td": {
                border: "1px solid rgba(0,0,0,0.12)",
                p: 1
              }
            }}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </CardContent>
            <div style={{ marginTop: 24 }}>
              <FeedbackForm topicId={id} lessonId={lesson?.id || null} />
            </div>
      </Card>
    </Stack>
  );
}