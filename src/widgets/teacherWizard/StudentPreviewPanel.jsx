import React from "react";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Divider
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function StudentPreviewPanel({ topic, lesson, tasks, test }) {
  const safeRu = React.useMemo(() => DOMPurify.sanitize(lesson.contentRu || "", { USE_PROFILES: { html: true } }), [lesson.contentRu]);

  return (
    <Card sx={{ position: { lg: "sticky" }, top: { lg: 16 }, alignSelf: "start" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Preview (как у ученика)
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Показываем RU-превью (KZ аналогично). Здесь нет проверки/attempt — только внешний вид.
        </Typography>

        {/* Topic preview */}
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(47,128,237,0.06)" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesomeIcon />
            <Typography sx={{ fontWeight: 900 }}>
              {topic.titleRu || "Название темы (RU)"}
            </Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {topic.descriptionRu || "Описание темы (RU)"}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            <Chip label="Урок" size="small" />
            <Chip label="Задания" size="small" />
            <Chip label="Тест" size="small" />
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Lesson preview */}
        <Typography sx={{ fontWeight: 900, mb: 1 }}>Урок (RU)</Typography>
        <Box
          sx={{
            maxHeight: 220,
            overflow: "auto",
            p: 1.25,
            borderRadius: 3,
            bgcolor: "rgba(242,153,74,0.08)",
            "& h1,& h2,& h3": { fontWeight: 900 },
            "& p": { lineHeight: 1.6 }
          }}
          dangerouslySetInnerHTML={{ __html: safeRu || "<p>Контент урока (RU)...</p>" }}
        />

        <Divider sx={{ my: 2 }} />

        {/* Tasks count */}
        <Typography sx={{ fontWeight: 900 }}>
          Задания: {tasks?.length || 0}
        </Typography>
        <Typography color="text.secondary">
          Типы: {(tasks || []).map((t) => t.type).filter(Boolean).join(", ") || "—"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Test count */}
        <Typography sx={{ fontWeight: 900 }}>
          Тест: {test?.questions?.length || 0} вопросов
        </Typography>
        <Typography color="text.secondary">
          {test?.titleRu || "Тест (RU)"}
        </Typography>
      </CardContent>
    </Card>
  );
}