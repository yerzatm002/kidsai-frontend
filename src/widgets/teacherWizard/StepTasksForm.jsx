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

import { teacherCreateTasks } from "../../shared/api/teacherContentApi";

function validateTask(t) {
  const e = {};
  if (!t.type) e.type = "Обязательно";
  if (!t.promptKz.trim()) e.promptKz = "Обязательно (KZ)";
  if (!t.promptRu.trim()) e.promptRu = "Обязательно (RU)";
  if (t.xpReward === "" || t.xpReward == null) e.xpReward = "Обязательно";
  if (!t.payload) e.payload = "Обязательно";
  // базовые проверки payload по типу:
  if (t.type === "SIMPLE") {
    const opts = t.payload?.options || [];
    if (!Array.isArray(opts) || opts.filter((x) => String(x).trim()).length < 2) e.payload = "Нужно минимум 2 варианта";
    if (typeof t.payload?.correctIndex !== "number") e.payload = "Укажите correctIndex (для teacher)";
  }
  if (t.type === "QA") {
    // можно оставить пусто или хранить "expectedAnswer" на сервере — зависит от бекенда
  }
  if (t.type === "DRAG_DROP") {
    const items = t.payload?.items || [];
    if (!Array.isArray(items) || items.filter((x) => String(x).trim()).length < 2) e.payload = "Нужно минимум 2 элемента";
  }
  return e;
}

export default function StepTasksForm({ topicId, tasks, setTasks, onBack, onSuccess }) {
  const [saving, setSaving] = React.useState(false);
  const [banner, setBanner] = React.useState(null);
  const [errors, setErrors] = React.useState({}); // { idx: {field: msg} }

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        type: "SIMPLE",
        promptKz: "",
        promptRu: "",
        xpReward: 10,
        payload: { options: ["", "", ""], correctIndex: 0 }
      }
    ]);
  };

  const removeTask = (idx) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTask = (idx, patch) => {
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  };

  const save = async () => {
    const allErrors = {};
    tasks.forEach((t, idx) => {
      const e = validateTask(t);
      if (Object.keys(e).length) allErrors[idx] = e;
    });

    setErrors(allErrors);

    if (Object.keys(allErrors).length) {
      setBanner({ type: "warning", text: "Проверьте задания: обязательные поля KZ+RU и корректный payload." });
      return;
    }

    setSaving(true);
    setBanner(null);

    try {
      await teacherCreateTasks(topicId, { items: tasks });
      setBanner({ type: "success", text: "Задания сохранены ✅" });
      onSuccess();
    } catch (e) {
      setBanner({ type: "error", text: e?.message || "Ошибка сохранения заданий" });
    } finally {
      setSaving(false);
    }
  };

  const renderPayloadEditor = (t, idx) => {
    if (t.type === "SIMPLE") {
      const opts = t.payload?.options || ["", "", ""];
      return (
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 800 }}>Варианты (options)</Typography>
          {opts.map((opt, j) => (
            <TextField
              key={j}
              label={`Option ${j + 1}`}
              value={opt}
              onChange={(e) => {
                const next = [...opts];
                next[j] = e.target.value;
                updateTask(idx, { payload: { ...t.payload, options: next } });
              }}
              fullWidth
            />
          ))}

          <TextField
            label="correctIndex (teacher only)"
            type="number"
            value={t.payload?.correctIndex ?? 0}
            onChange={(e) =>
              updateTask(idx, {
                payload: { ...t.payload, correctIndex: Number(e.target.value) }
              })
            }
            fullWidth
          />
        </Stack>
      );
    }

    if (t.type === "DRAG_DROP") {
      const items = t.payload?.items || ["", ""];
      return (
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 800 }}>Элементы (items)</Typography>
          {items.map((it, j) => (
            <TextField
              key={j}
              label={`Item ${j + 1}`}
              value={it}
              onChange={(e) => {
                const next = [...items];
                next[j] = e.target.value;
                updateTask(idx, { payload: { ...t.payload, items: next } });
              }}
              fullWidth
            />
          ))}
        </Stack>
      );
    }

    // QA — минимально: payload пустой объект
    return (
      <Alert severity="info" sx={{ borderRadius: 3 }}>
        QA: ученик вводит короткий ответ. payload можно оставить пустым: {"{}"}.
      </Alert>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Шаг 3 — Задания
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          Добавьте задания (SIMPLE / DRAG_DROP / QA). Обязательны promptKZ и promptRU.
        </Typography>

        {banner ? (
          <Alert severity={banner.type} sx={{ mb: 2, borderRadius: 3 }}>
            {banner.text}
          </Alert>
        ) : null}

        <Stack spacing={2}>
          {tasks.map((t, idx) => {
            const e = errors[idx] || {};
            return (
              <Card key={idx} sx={{ bgcolor: "rgba(47,128,237,0.03)" }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 900 }}>Задание #{idx + 1}</Typography>
                    <IconButton onClick={() => removeTask(idx)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>

                  <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                    <TextField
                      select
                      label="Тип"
                      value={t.type}
                      onChange={(ev) => {
                        const type = ev.target.value;
                        let payload = t.payload;
                        if (type === "SIMPLE") payload = { options: ["", "", ""], correctIndex: 0 };
                        if (type === "DRAG_DROP") payload = { items: ["", ""] };
                        if (type === "QA") payload = {};
                        updateTask(idx, { type, payload });
                      }}
                      error={!!e.type}
                      helperText={e.type}
                      fullWidth
                    >
                      <MenuItem value="SIMPLE">SIMPLE</MenuItem>
                      <MenuItem value="DRAG_DROP">DRAG_DROP</MenuItem>
                      <MenuItem value="QA">QA</MenuItem>
                    </TextField>

                    <TextField
                      label="Prompt (KZ)"
                      value={t.promptKz}
                      onChange={(ev) => updateTask(idx, { promptKz: ev.target.value })}
                      error={!!e.promptKz}
                      helperText={e.promptKz}
                      fullWidth
                    />
                    <TextField
                      label="Prompt (RU)"
                      value={t.promptRu}
                      onChange={(ev) => updateTask(idx, { promptRu: ev.target.value })}
                      error={!!e.promptRu}
                      helperText={e.promptRu}
                      fullWidth
                    />

                    <TextField
                      label="XP reward"
                      type="number"
                      value={t.xpReward}
                      onChange={(ev) => updateTask(idx, { xpReward: Number(ev.target.value) })}
                      error={!!e.xpReward}
                      helperText={e.xpReward}
                      fullWidth
                    />

                    {e.payload ? (
                      <Alert severity="warning" sx={{ borderRadius: 3 }}>
                        {e.payload}
                      </Alert>
                    ) : null}

                    <Divider />

                    {renderPayloadEditor(t, idx)}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}

          <Button startIcon={<AddIcon />} variant="outlined" onClick={addTask}>
            Добавить задание
          </Button>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onBack}>
              Назад
            </Button>
            <Button onClick={save} disabled={saving} startIcon={<SaveIcon />}>
              {saving ? "Сохраняем..." : "Сохранить и продолжить"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}