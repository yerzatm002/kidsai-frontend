import React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Button,
  Alert
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ImageIcon from "@mui/icons-material/Image";
import ImageUploader from "../../shared/ui/files/ImageUploader";
import { uploadImageAndGetPublicUrl } from "../../shared/files/supabaseSignedUpload";

import { teacherCreateTopic, teacherPatchTopic, getSignedUpload } from "../../shared/api/teacherContentApi";
import { uploadToSignedUrl } from "../../shared/files/uploadToSignedUrl";

function validate(topic) {
  const errors = {};
  if (!topic.titleKz.trim()) errors.titleKz = "Обязательно (KZ)";
  if (!topic.titleRu.trim()) errors.titleRu = "Обязательно (RU)";
  if (!topic.descriptionKz.trim()) errors.descriptionKz = "Обязательно (KZ)";
  if (!topic.descriptionRu.trim()) errors.descriptionRu = "Обязательно (RU)";
  if (topic.orderIndex === "" || topic.orderIndex == null) errors.orderIndex = "Обязательно";
  return errors;
}

export default function StepTopicForm({ topic, setTopic, topicId, setTopicId, onSuccess }) {
  const [errors, setErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [banner, setBanner] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState("");
  const [coverFile, setCoverFile] = React.useState(null);

  // eslint-disable-next-line no-unused-vars
  const onPickCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setBanner({ type: "info", text: `Файл выбран: ${file.name}` });
  };

  const save = async () => {
    const v = validate(topic);
    setErrors(v);
    if (Object.keys(v).length) {
      setBanner({ type: "warning", text: "Заполните обязательные поля KZ + RU." });
      return;
    }

    setSaving(true);
    setBanner(null);

    try {
      // 1) создать тему (если ещё нет)
      let id = topicId;
      if (!id) {
        const res = await teacherCreateTopic({
          titleKz: topic.titleKz,
          titleRu: topic.titleRu,
          descriptionKz: topic.descriptionKz,
          descriptionRu: topic.descriptionRu,
          orderIndex: Number(topic.orderIndex)
        });

        // Поддержка разных форматов ответа
        id = res?.topic?.id ?? res?.id ?? res?.topicId;
        if (!id) throw new Error("Не удалось получить topicId из ответа сервера.");
        setTopicId(id);
      } else {
        // если редактируем тему в шаге 1 — PATCH
        await teacherPatchTopic(id, {
          titleKz: topic.titleKz,
          titleRu: topic.titleRu,
          descriptionKz: topic.descriptionKz,
          descriptionRu: topic.descriptionRu,
          orderIndex: Number(topic.orderIndex)
        });
      }

      // 2) если есть обложка — загрузить в storage и PATCH coverImageUrl
      if (coverFile) {
        const signed = await getSignedUpload({
          fileName: coverFile.name,
          contentType: coverFile.type,
          folder: "topics"
        });

        await uploadToSignedUrl({ signedUrl: signed.signedUrl, file: coverFile });

        await teacherPatchTopic(id, {
          coverImageUrl: signed.publicUrl
        });

        setTopic((prev) => ({ ...prev, coverImageUrl: signed.publicUrl }));
      }

      setBanner({ type: "success", text: "Тема сохранена ✅" });
      onSuccess();
    } catch (e) {
      setBanner({ type: "error", text: e?.message || "Ошибка сохранения темы" });
    } finally {
      setSaving(false);
    }
  };

  const uploadCover = async (file) => {
    setUploading(true);
    setUploadErr("");
    setBanner(null);

    try {
        // если topic ещё не создан — создаём, чтобы было куда PATCH
        let id = topicId;
        if (!id) {
        const v = validate(topic);
        setErrors(v);
        if (Object.keys(v).length) {
            throw new Error("Сначала заполните обязательные поля темы (KZ+RU), затем загрузите обложку.");
        }

        const res = await teacherCreateTopic({
            titleKz: topic.titleKz,
            titleRu: topic.titleRu,
            descriptionKz: topic.descriptionKz,
            descriptionRu: topic.descriptionRu,
            orderIndex: Number(topic.orderIndex)
        });

        id = res?.topic?.id ?? res?.id ?? res?.topicId;
        if (!id) throw new Error("Не удалось получить topicId из ответа сервера.");
        setTopicId(id);
        }

        const publicUrl = await uploadImageAndGetPublicUrl({ file, folder: "topics" });

        await teacherPatchTopic(id, { coverImageUrl: publicUrl });

        setTopic((p) => ({ ...p, coverImageUrl: publicUrl }));
        setBanner({ type: "success", text: "Обложка загружена ✅" });
    } catch (e) {
        setUploadErr(e?.message || "Ошибка загрузки изображения");
    } finally {
        setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Шаг 1 — Тема
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          Заполните поля KZ и RU. Обложка — по желанию.
        </Typography>

        {banner ? (
          <Alert severity={banner.type} sx={{ mb: 2, borderRadius: 3 }}>
            {banner.text}
          </Alert>
        ) : null}

        <Stack spacing={1.5}>
          <TextField
            label="Название (KZ)"
            value={topic.titleKz}
            onChange={(e) => setTopic((p) => ({ ...p, titleKz: e.target.value }))}
            error={!!errors.titleKz}
            helperText={errors.titleKz}
            fullWidth
          />
          <TextField
            label="Название (RU)"
            value={topic.titleRu}
            onChange={(e) => setTopic((p) => ({ ...p, titleRu: e.target.value }))}
            error={!!errors.titleRu}
            helperText={errors.titleRu}
            fullWidth
          />

          <TextField
            label="Описание (KZ)"
            value={topic.descriptionKz}
            onChange={(e) => setTopic((p) => ({ ...p, descriptionKz: e.target.value }))}
            error={!!errors.descriptionKz}
            helperText={errors.descriptionKz}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Описание (RU)"
            value={topic.descriptionRu}
            onChange={(e) => setTopic((p) => ({ ...p, descriptionRu: e.target.value }))}
            error={!!errors.descriptionRu}
            helperText={errors.descriptionRu}
            fullWidth
            multiline
            minRows={3}
          />

          <TextField
            label="Порядок (orderIndex)"
            type="number"
            value={topic.orderIndex}
            onChange={(e) => setTopic((p) => ({ ...p, orderIndex: e.target.value }))}
            error={!!errors.orderIndex}
            helperText={errors.orderIndex}
            fullWidth
          />

        <ImageUploader
        label="Загрузить обложку темы"
        valueUrl={topic.coverImageUrl}
        uploading={uploading}
        errorText={uploadErr}
        onFilePicked={uploadCover}
        onRemove={() => setTopic((p) => ({ ...p, coverImageUrl: "" }))}
        />

          <Button onClick={save} disabled={saving} startIcon={<SaveIcon />}>
            {saving ? "Сохраняем..." : topicId ? "Сохранить и продолжить" : "Создать тему и продолжить"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}