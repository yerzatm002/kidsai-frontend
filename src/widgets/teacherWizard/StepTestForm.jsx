import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Alert,
  TextField,
  MenuItem,
  IconButton,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import { teacherCreateTest, teacherAddQuestions } from "../../shared/api/teacherContentApi";

function validateTest(test) {
  const errors = {};
  if (!test.titleKz.trim()) errors.titleKz = "Обязательно (KZ)";
  if (!test.titleRu.trim()) errors.titleRu = "Обязательно (RU)";

  const qErrors = {};
  test.questions.forEach((q, idx) => {
    const e = {};
    if (!q.type) e.type = "Обязательно";
    if (!q.promptKz.trim()) e.promptKz = "Обязательно (KZ)";
    if (!q.promptRu.trim()) e.promptRu = "Обязательно (RU)";
    if (!Array.isArray(q.options) || q.options.filter((x) => String(x).trim()).length < 2) e.options = "Нужно минимум 2 option";
    if (!Array.isArray(q.correct) || q.correct.length < 1) e.correct = "Нужно указать correct[]";
    if (q.points === "" || q.points == null) e.points = "Обязательно";
    if (Object.keys(e).length) qErrors[idx] = e;
  });

  return { errors, qErrors };
}

export default function StepTestForm({
  topicId,
  test,
  setTest,
  testId,
  setTestId,
  onBack,
  onSuccess
}) {
  const [saving, setSaving] = React.useState(false);
  const [banner, setBanner] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [qErrors, setQErrors] = React.useState({});

  const addQuestion = () => {
    setTest((p) => ({
      ...p,
      questions: [
        ...p.questions,
        {
          type: "SINGLE",
          promptKz: "",
          promptRu: "",
          options: ["", "", ""],
          correct: [0],
          points: 2
        }
      ]
    }));
  };

  const removeQuestion = (idx) => {
    setTest((p) => ({ ...p, questions: p.questions.filter((_, i) => i !== idx) }));
  };

  const updateQuestion = (idx, patch) => {
    setTest((p) => ({
      ...p,
      questions: p.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q))
    }));
  };

  const save = async () => {
    const v = validateTest(test);
    setErrors(v.errors);
    setQErrors(v.qErrors);

    if (Object.keys(v.errors).length || Object.keys(v.qErrors).length) {
      setBanner({ type: "warning", text: "Заполните обязательные поля KZ+RU и проверьте вопросы." });
      return;
    }

    setSaving(true);
    setBanner(null);

    try {
      let id = testId;
      if (!id) {
        const res = await teacherCreateTest(topicId, {
          titleKz: test.titleKz,
          titleRu: test.titleRu
        });

        id = res?.test?.id ?? res?.id ?? res?.testId;
        if (!id) throw new Error("Не удалось получить testId из ответа сервера.");
        setTestId(id);
      }

      // добавляем вопросы пачкой
      await teacherAddQuestions(id, {
        items: test.questions.map((q) => ({
          type: q.type,
          promptKz: q.promptKz,
          promptRu: q.promptRu,
          options: q.options,
          correct: q.correct,
          points: Number(q.points)
        }))
      });

      setBanner({ type: "success", text: "Тест и вопросы сохранены ✅" });
      onSuccess();
    } catch (e) {
      setBanner({ type: "error", text: e?.message || "Ошибка сохранения теста" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Шаг 4 — Тест
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          Типы вопросов: SINGLE / MULTI. Обязательны KZ+RU.
        </Typography>

        {banner ? (
          <Alert severity={banner.type} sx={{ mb: 2, borderRadius: 3 }}>
            {banner.text}
          </Alert>
        ) : null}

        <Stack spacing={1.5}>
          <TextField
            label="Название теста (KZ)"
            value={test.titleKz}
            onChange={(e) => setTest((p) => ({ ...p, titleKz: e.target.value }))}
            error={!!errors.titleKz}
            helperText={errors.titleKz}
            fullWidth
          />
          <TextField
            label="Название теста (RU)"
            value={test.titleRu}
            onChange={(e) => setTest((p) => ({ ...p, titleRu: e.target.value }))}
            error={!!errors.titleRu}
            helperText={errors.titleRu}
            fullWidth
          />

          <Divider />

          <Typography sx={{ fontWeight: 900 }}>Вопросы</Typography>

          <Stack spacing={2}>
            {test.questions.map((q, idx) => {
              const e = qErrors[idx] || {};
              return (
                <Card key={idx} sx={{ bgcolor: "rgba(242,153,74,0.08)" }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontWeight: 900 }}>Вопрос #{idx + 1}</Typography>
                      <IconButton onClick={() => removeQuestion(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                      <TextField
                        select
                        label="Type"
                        value={q.type}
                        onChange={(ev) => updateQuestion(idx, { type: ev.target.value })}
                        error={!!e.type}
                        helperText={e.type}
                        fullWidth
                      >
                        <MenuItem value="SINGLE">SINGLE</MenuItem>
                        <MenuItem value="MULTI">MULTI</MenuItem>
                      </TextField>

                      <TextField
                        label="Prompt (KZ)"
                        value={q.promptKz}
                        onChange={(ev) => updateQuestion(idx, { promptKz: ev.target.value })}
                        error={!!e.promptKz}
                        helperText={e.promptKz}
                        fullWidth
                      />
                      <TextField
                        label="Prompt (RU)"
                        value={q.promptRu}
                        onChange={(ev) => updateQuestion(idx, { promptRu: ev.target.value })}
                        error={!!e.promptRu}
                        helperText={e.promptRu}
                        fullWidth
                      />

                      {e.options ? (
                        <Alert severity="warning" sx={{ borderRadius: 3 }}>
                          {e.options}
                        </Alert>
                      ) : null}

                      {(q.options || ["", ""]).map((opt, j) => (
                        <TextField
                          key={j}
                          label={`Option ${j + 1}`}
                          value={opt}
                          onChange={(ev) => {
                            const next = [...q.options];
                            next[j] = ev.target.value;
                            updateQuestion(idx, { options: next });
                          }}
                          fullWidth
                        />
                      ))}

                      {e.correct ? (
                        <Alert severity="warning" sx={{ borderRadius: 3 }}>
                          {e.correct}
                        </Alert>
                      ) : null}

                      <TextField
                        label={`correct[] (индексы через запятую, напр. "1" или "0,2")`}
                        value={(q.correct || []).join(",")}
                        onChange={(ev) => {
                          const raw = ev.target.value;
                          const arr = raw
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean)
                            .map((x) => Number(x))
                            .filter((n) => Number.isFinite(n));
                          updateQuestion(idx, { correct: arr.length ? arr : [] });
                        }}
                        fullWidth
                      />

                      <TextField
                        label="points"
                        type="number"
                        value={q.points}
                        onChange={(ev) => updateQuestion(idx, { points: Number(ev.target.value) })}
                        error={!!e.points}
                        helperText={e.points}
                        fullWidth
                      />
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          <Button startIcon={<AddIcon />} variant="outlined" onClick={addQuestion}>
            Добавить вопрос
          </Button>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onBack}>
              Назад
            </Button>
            <Button onClick={save} disabled={saving} startIcon={<SaveIcon />}>
              {saving ? "Сохраняем..." : "Сохранить и завершить"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}