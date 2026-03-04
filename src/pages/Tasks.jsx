import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Skeleton,
  Alert,
  Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import { useTranslation } from "react-i18next";
import { useLang } from "../shared/hooks/useLang";
import { getTopicById } from "../shared/api/topicsApi";
import { getTasksByTopicId, submitTaskAttempt } from "../shared/api/tasksApi";
import { normalizeApiError } from "../shared/api/apiClient";
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";

import TaskRenderer from "../widgets/tasks/TaskRenderer";
import AttemptResultCard from "../widgets/tasks/AttemptResultCard";

export default function Tasks() {
  const { id } = useParams(); // topicId
  const { t } = useTranslation();
  const lang = useLang();
  const { notify } = useNotify();

  const [loading, setLoading] = React.useState(true);
  const [topic, setTopic] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);
  const [index, setIndex] = React.useState(0);

  // состояние ответа (формирует TaskRenderer)
  const [answerPayload, setAnswerPayload] = React.useState(null);

  // результат попытки (приходит с API)
  const [attemptResult, setAttemptResult] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const currentTask = tasks[index] || null;

  const load = React.useCallback(async () => {
    setLoading(true);
    setAttemptResult(null);
    setAnswerPayload(null);
    try {
      const [topicData, tasksData] = await Promise.all([
        getTopicById(id),
        getTasksByTopicId(id)
      ]);
      setTopic(topicData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setIndex(0);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setTopic(null);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  React.useEffect(() => {
    load();
  }, [load, lang]);

  const goPrev = () => {
    setAttemptResult(null);
    setAnswerPayload(null);
    setIndex((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    setAttemptResult(null);
    setAnswerPayload(null);
    setIndex((i) => Math.min(tasks.length - 1, i + 1));
  };

  const onSubmit = async () => {
    if (!currentTask) return;
    if (answerPayload == null) {
      notify(t("tasks.answerRequired"), "warning");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitTaskAttempt(currentTask.id, answerPayload);
      // ВАЖНО: доверяем только ответу сервера (correct/xpAwarded/level/xp)
      setAttemptResult(result);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton height={44} width="60%" />
        <Skeleton variant="rounded" height={160} />
        <Skeleton variant="rounded" height={320} />
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      {/* Верхняя карточка */}
      <Card>
        <CardContent>
          <Stack spacing={0.75}>
            <Typography variant="overline" color="text.secondary">
              {t("tasks.title")}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {topic?.title || t("tasks.title")}
            </Typography>
            <Typography color="text.secondary">
              {t("tasks.subtitle")}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 1.5 }}>
              <Button
                component={RouterLink}
                to={`/topics/${id}`}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
              >
                {t("tasks.backToTopic")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {tasks.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          {t("tasks.empty")}
        </Alert>
      ) : (
        <>
          {/* Навигация по заданиям */}
          <Card>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ sm: "center" }}>
                <Typography sx={{ fontWeight: 900 }}>
                  {index + 1} / {tasks.length}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={goPrev}
                    disabled={index === 0}
                  >
                    {t("tasks.prev")}
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<NavigateNextIcon />}
                    onClick={goNext}
                    disabled={index === tasks.length - 1}
                  >
                    {t("tasks.next")}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Само задание */}
          <Card>
            <CardContent>
              <TaskRenderer
                task={currentTask}
                onAnswerChange={(payload) => {
                  setAnswerPayload(payload);
                  // если пользователь изменил ответ — сбрасываем прошлый результат
                  setAttemptResult(null);
                }}
              />

              <Divider sx={{ my: 2 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  onClick={onSubmit}
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? t("tasks.submitting") : t("tasks.submit")}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setAnswerPayload(null);
                    setAttemptResult(null);
                  }}
                  fullWidth
                >
                  {t("tasks.tryAgain")}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Результат попытки (строго из API) */}
          {attemptResult ? <AttemptResultCard result={attemptResult} /> : null}
        </>
      )}
    </Stack>
  );
}