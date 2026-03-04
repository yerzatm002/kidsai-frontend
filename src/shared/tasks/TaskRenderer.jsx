import React from "react";
import { Alert } from "@mui/material";
import { SimpleTask } from "./types/SimpleTask";
import { QATask } from "./types/QATask";
import { DragDropTask } from "./types/DragDropTask";
import { useTranslation } from "react-i18next";

export function TaskRenderer({ task, onSubmit }) {
  const { t } = useTranslation();

  switch (task.type) {
    case "SIMPLE":
      return <SimpleTask task={task} onSubmit={onSubmit} />;
    case "QA":
      return <QATask task={task} onSubmit={onSubmit} />;
    case "DRAG_DROP":
      return <DragDropTask task={task} onSubmit={onSubmit} />;
    default:
      return <Alert severity="info">{t("tasks.unknownType")}: {task.type}</Alert>;
  }
}