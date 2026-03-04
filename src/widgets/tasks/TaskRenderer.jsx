import React from "react";
import { Alert, Typography } from "@mui/material";
import SimpleTask from "./types/SimpleTask";
import QATask from "./types/QATask";
import DragDropTask from "./types/DragDropTask";

export default function TaskRenderer({ task, onAnswerChange }) {
  if (!task) return null;

  const type = task.type;

  // Важно: не используем correctIndex на фронте — только показываем UI и отправляем answerPayload.
  if (type === "SIMPLE") {
    return <SimpleTask task={task} onAnswerChange={onAnswerChange} />;
  }

  if (type === "QA") {
    return <QATask task={task} onAnswerChange={onAnswerChange} />;
  }

  if (type === "DRAG_DROP") {
    return <DragDropTask task={task} onAnswerChange={onAnswerChange} />;
  }

  return (
    <Alert severity="info" sx={{ borderRadius: 3 }}>
      <Typography sx={{ fontWeight: 800 }}>
        Неизвестный тип задания: {String(type)}
      </Typography>
    </Alert>
  );
}