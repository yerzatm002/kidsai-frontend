import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Button,
  Alert,
  Chip
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from "react-i18next";

import { teacherGetFeedback } from "../../shared/api/feedbackApi";
import { normalizeApiError } from "../../shared/api/apiClient";
import { useNotify } from "../../shared/ui/notifications/NotificationsProvider";

export default function TeacherFeedback() {
  const { t } = useTranslation();
  const { notify } = useNotify();

  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [loading, setLoading] = React.useState(true);

  const [total, setTotal] = React.useState(0);
  const [items, setItems] = React.useState([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      // GET /api/teacher/feedback?page=1&pageSize=20 :contentReference[oaicite:6]{index=6}
      const res = await teacherGetFeedback({ page, pageSize });
      setTotal(res?.total ?? 0);
      setItems(res?.items || []);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, notify]);

  React.useEffect(() => { load(); }, [load]);

  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 900, flex: 1 }}>
              {t("teacherFeedback.title")}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={load}
              disabled={loading}
            >
              Refresh
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            <Chip label={`page: ${page}/${maxPage}`} />
            <Chip label={`total: ${total}`} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              Loading...
            </Alert>
          ) : items.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              {t("teacherFeedback.empty")}
            </Alert>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>{t("teacherFeedback.user")}</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{t("teacherFeedback.grade")}</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{t("teacherFeedback.topic")}</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{t("teacherFeedback.lesson")}</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{t("teacherFeedback.rating")}</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{t("teacherFeedback.status")}</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{t("teacherFeedback.createdAt")}</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((it) => (
                    <TableRow key={it.id} hover>
                      <TableCell sx={{ fontWeight: 800 }}>
                        {it.user?.fullName || it.user?.id || "—"}
                      </TableCell>
                      <TableCell>{it.user?.grade ?? "—"}</TableCell>
                      <TableCell>{it.topicId || "—"}</TableCell>
                      <TableCell>{it.lessonId || "—"}</TableCell>
                      <TableCell>{it.rating ?? "—"}</TableCell>
                      <TableCell>
                        <Chip
                          label={it.status || "—"}
                          size="small"
                          color={it.status === "NEW" ? "warning" : "default"}
                        />
                      </TableCell>
                      <TableCell>
                        {it.createdAt ? new Date(it.createdAt).toLocaleString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 2 }} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Prev
            </Button>
            <Button
              variant="outlined"
              endIcon={<NavigateNextIcon />}
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              disabled={page >= maxPage || loading}
            >
              Next
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}