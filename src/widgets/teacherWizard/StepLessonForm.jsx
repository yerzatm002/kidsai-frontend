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

import { teacherCreateLesson, teacherPatchLesson, getSignedUpload } from "../../shared/api/teacherContentApi";
import { uploadToSignedUrl } from "../../shared/files/uploadToSignedUrl";

function validate(lesson) {
  const errors = {};
  if (!lesson.contentKz.trim()) errors.contentKz = "Обязательно (KZ)";
  if (!lesson.contentRu.trim()) errors.contentRu = "Обязательно (RU)";
  return errors;
}

export default function StepLessonForm({
  topicId,
  lesson,
  setLesson,
  lessonId,
  setLessonId,
  onBack,
  onSuccess
}) {
  const [errors, setErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [banner, setBanner] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  const [uploading, setUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState("");

  // eslint-disable-next-line no-unused-vars
  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setBanner({ type: "info", text: `Файл выбран: ${file.name}` });
  };

  const save = async () => {
    const v = validate(lesson);
    setErrors(v);
    if (Object.keys(v).length) {
      setBanner({ type: "warning", text: "Заполните контент KZ + RU." });
      return;
    }

    setSaving(true);
    setBanner(null);

    try {
      let id = lessonId;

      if (!id) {
        const res = await teacherCreateLesson(topicId, {
          contentKz: lesson.contentKz,
          contentRu: lesson.contentRu,
          imageUrl: lesson.imageUrl || null,
          videoUrl: lesson.videoUrl || null
        });

        id = res?.lesson?.id ?? res?.id ?? res?.lessonId;
        if (!id) throw new Error("Не удалось получить lessonId из ответа сервера.");
        setLessonId(id);
      } else {
        await teacherPatchLesson(id, {
          contentKz: lesson.contentKz,
          contentRu: lesson.contentRu,
          imageUrl: lesson.imageUrl || null,
          videoUrl: lesson.videoUrl || null
        });
      }

      if (imageFile) {
        const signed = await getSignedUpload({
          fileName: imageFile.name,
          contentType: imageFile.type,
          folder: "lessons"
        });

        await uploadToSignedUrl({ signedUrl: signed.signedUrl, file: imageFile });

        await teacherPatchLesson(id, { imageUrl: signed.publicUrl });
        setLesson((p) => ({ ...p, imageUrl: signed.publicUrl }));
      }

      setBanner({ type: "success", text: "Урок сохранён ✅" });
      onSuccess();
    } catch (e) {
      setBanner({ type: "error", text: e?.message || "Ошибка сохранения урока" });
    } finally {
      setSaving(false);
    }
  };

  const uploadLessonImage = async (file) => {
  setUploading(true);
  setUploadErr("");
  setBanner(null);

  try {
    // если урок ещё не создан — создаём, чтобы было куда PATCH
    let id = lessonId;
    if (!id) {
      const v = validate(lesson);
      setErrors(v);
      if (Object.keys(v).length) {
        throw new Error("Сначала заполните контент урока (KZ+RU), затем загрузите картинку.");
      }

      const res = await teacherCreateLesson(topicId, {
        contentKz: lesson.contentKz,
        contentRu: lesson.contentRu,
        imageUrl: null,
        videoUrl: lesson.videoUrl || null
      });

      id = res?.lesson?.id ?? res?.id ?? res?.lessonId;
      if (!id) throw new Error("Не удалось получить lessonId из ответа сервера.");
      setLessonId(id);
    }

    const publicUrl = await uploadImageAndGetPublicUrl({ file, folder: "lessons" });

    await teacherPatchLesson(id, { imageUrl: publicUrl });

    setLesson((p) => ({ ...p, imageUrl: publicUrl }));
    setBanner({ type: "success", text: "Картинка урока загружена ✅" });
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
          Шаг 2 — Урок
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          Контент (HTML/Markdown) обязателен на KZ и RU. Картинка/видео — по желанию.
        </Typography>

        {banner ? (
          <Alert severity={banner.type} sx={{ mb: 2, borderRadius: 3 }}>
            {banner.text}
          </Alert>
        ) : null}

        <Stack spacing={1.5}>
          <TextField
            label="Контент (KZ)"
            value={lesson.contentKz}
            onChange={(e) => setLesson((p) => ({ ...p, contentKz: e.target.value }))}
            error={!!errors.contentKz}
            helperText={errors.contentKz}
            fullWidth
            multiline
            minRows={8}
          />
          <TextField
            label="Контент (RU)"
            value={lesson.contentRu}
            onChange={(e) => setLesson((p) => ({ ...p, contentRu: e.target.value }))}
            error={!!errors.contentRu}
            helperText={errors.contentRu}
            fullWidth
            multiline
            minRows={8}
          />

          <TextField
            label="Video URL (optional)"
            value={lesson.videoUrl}
            onChange={(e) => setLesson((p) => ({ ...p, videoUrl: e.target.value }))}
            fullWidth
          />

            <ImageUploader
            label="Загрузить картинку урока"
            valueUrl={lesson.imageUrl}
            uploading={uploading}
            errorText={uploadErr}
            onFilePicked={uploadLessonImage}
            onRemove={() => setLesson((p) => ({ ...p, imageUrl: "" }))}
            />

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