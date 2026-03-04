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
import { useNotify } from "../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../shared/api/apiClient";
import { getTopicById } from "../shared/api/topicsApi";
import { getTestByTopicId, submitTestAttempt } from "../shared/api/testApi";

import QuestionCard from "../widgets/test/QuestionCard";
import TestResultCard from "../widgets/test/TestResultCard";
import ReviewCard from "../widgets/test/ReviewCard";

export default function Test() {
  const { id } = useParams(); // topicId
  const { t } = useTranslation();
  const lang = useLang();
  const { notify } = useNotify();

  const [loading, setLoading] = React.useState(true);
  const [topic, setTopic] = React.useState(null);
  const [test, setTest] = React.useState(null);

  const [qIndex, setQIndex] = React.useState(0);

  // answersMap: { [questionId]: number[] }
  const [answersMap, setAnswersMap] = React.useState({});

  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null); // результат попытки (score/review)

  const load = React.useCallback(async () => {
    setLoading(true);
    setResult(null);
    setAnswersMap({});
    setQIndex(0);
    try {
      const [topicData, testData] = await Promise.all([getTopicById(id), getTestByTopicId(id)]);
      setTopic(topicData);
      setTest(testData);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setTopic(null);
      setTest(null);
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  React.useEffect(() => {
    load();
  }, [load, lang]);

  const questions = test?.questions || [];
  const current = questions[qIndex] || null;

  const setSelected = (questionId, selected) => {
    setAnswersMap((prev) => ({ ...prev, [questionId]: selected }));
  };

  const canGoPrev = qIndex > 0;
  const canGoNext = qIndex < questions.length - 1;

  const goPrev = () => setQIndex((i) => Math.max(0, i - 1));
  const goNext = () => setQIndex((i) => Math.min(questions.length - 1, i + 1));

  const submit = async () => {
    if (!test?.testId) return;

    // формируем answers строго по доке: { questionId, selected:[...] } :contentReference[oaicite:7]{index=7}
    const answers = questions.map((q) => ({
      questionId: q.id,
      selected: answersMap[q.id] || []
    }));

    setSubmitting(true);
    try {
      const res = await submitTestAttempt(test.testId, answers);
      setResult(res);
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

  if (!test) {
    return (
      <Alert severity="info" sx={{ borderRadius: 3 }}>
        {t("test.title")}: недоступен
      </Alert>
    );
  }

  return (
    <Stack spacing={2.5}>
      {/* Шапка */}
      <Card>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            {t("test.title")}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {topic?.title || test.title || t("test.title")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {t("test.subtitle")}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 1.5 }}>
            <Button
              component={RouterLink}
              to={`/topics/${id}`}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              {t("test.backToTopic")}
            </Button>

            <Button
              variant="outlined"
              onClick={() => load()}
            >
              {t("test.retry")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* До сабмита — показываем тест */}
      {!result ? (
        <>
          <Card>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ sm: "center" }}>
                <Typography sx={{ fontWeight: 900 }}>
                  {t("test.progress")} {qIndex + 1} {t("test.of")} {questions.length}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={goPrev}
                    disabled={!canGoPrev}
                  >
                    Назад
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<NavigateNextIcon />}
                    onClick={goNext}
                    disabled={!canGoNext}
                  >
                    Далее
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {current ? (
            <QuestionCard
              question={current}
              selected={answersMap[current.id] || []}
              onChange={(selected) => setSelected(current.id, selected)}
            />
          ) : null}

          <Card>
            <CardContent>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Готово? Отправь тест — оценка придёт с сервера.
              </Typography>
              <Button onClick={submit} disabled={submitting} fullWidth>
                {submitting ? t("test.submitting") : t("test.submit")}
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Результат */}
          <TestResultCard result={result} />

          {/* Разбор — только из review */}
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {t("test.reviewTitle")}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Правильные ответы показываются из review (ответ сервера), а не “угадываются”.
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                {(result.review || []).map((r, idx2) => (
                  <ReviewCard
                    key={idx2}
                    questions={questions}
                    answersMap={answersMap}
                    reviewItem={r}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}