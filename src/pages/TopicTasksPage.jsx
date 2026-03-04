import React from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, Alert, Skeleton } from "@mui/material";
import { getTopicTasks } from "../api/tasks";
import { TaskPlayer } from "../tasks/TaskPlayer";
import { useTranslation } from "react-i18next";

export function TopicTasksPage() {
  const { id: topicId } = useParams();
  const { t, i18n } = useTranslation();

  const [state, setState] = React.useState({ status: "loading", data: null, error: null });

  const load = React.useCallback(async () => {
    try {
      setState({ status: "loading", data: null, error: null });
      const data = await getTopicTasks(topicId);
      setState({ status: "ready", data, error: null });
    } catch (e) {
      setState({ status: "error", data: null, error: e });
    }
  }, [topicId]);

  React.useEffect(() => { load(); }, [load]);

  // важно: при переключении языка UI — перезагружаем контент заданий
  React.useEffect(() => { load(); }, [i18n.language, load]);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        {t("tasks.title")}
      </Typography>

      {state.status === "loading" && (
        <Box>
          <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={260} />
        </Box>
      )}

      {state.status === "error" && (
        <Alert severity="error">
          {t("errors.tasksLoad")}
        </Alert>
      )}

      {state.status === "ready" && (
        <TaskPlayer topicId={topicId} tasks={state.data?.items || []} />
      )}
    </Container>
  );
}