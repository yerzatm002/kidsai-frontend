import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Drawer,
  Skeleton,
  Alert,
  LinearProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { teacherGetStudents, teacherGetStudentProgress } from "../../shared/api/teacherStudentsApi";
import { normalizeApiError } from "../../shared/api/apiClient";
import { useNotify } from "../../shared/ui/notifications/NotificationsProvider";
import StudentProgressCards from "../../widgets/teacherStudents/StudentProgressCards";

export default function TeacherStudents() {
  const { notify } = useNotify();

  const [grade, setGrade] = React.useState("5"); // по умолчанию 5 класс
  const [loading, setLoading] = React.useState(true);
  const [students, setStudents] = React.useState([]);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);

  const [progressLoading, setProgressLoading] = React.useState(false);
  const [progressItems, setProgressItems] = React.useState([]);

  const loadStudents = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await teacherGetStudents({ grade });
      const items = Array.isArray(data) ? data : (data?.items || []);
      setStudents(items);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [grade, notify]);

  React.useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const openProgress = async (student) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
    setProgressItems([]);
    setProgressLoading(true);

    try {
      const data = await teacherGetStudentProgress(student.id);
      const items = data?.items || data?.progress || (Array.isArray(data) ? data : []);
      setProgressItems(items);
    } catch (e) {
      const err = normalizeApiError(e);
      notify(err.message, "error");
      setProgressItems([]);
    } finally {
      setProgressLoading(false);
    }
  };

  // Быстрая эвристика "кто отстаёт": если нет урока и мало заданий
  // eslint-disable-next-line no-unused-vars
  const calcRisk = (s) => {
    // если backend отдаёт агрегаты в списке студентов — используйте их.
    // иначе просто нейтрально:
    return "unknown";
  };

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Учительский кабинет — Ученики
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Фильтр по классу + просмотр прогресса по темам.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            sx={{ mt: 2 }}
            alignItems={{ sm: "center" }}
          >
            <TextField
              select
              label="Класс (grade)"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="7">7</MenuItem>
              <MenuItem value="8">8</MenuItem>
              <MenuItem value="9">9</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="11">11</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadStudents}
              disabled={loading}
            >
              Обновить
            </Button>

            <Box sx={{ flex: 1 }} />

            <Chip
              label={`Всего: ${students.length}`}
              variant="outlined"
              sx={{ fontWeight: 800 }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? (
            <Stack spacing={1.5}>
              <Skeleton height={36} />
              <Skeleton height={36} />
              <Skeleton height={36} />
            </Stack>
          ) : students.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              Нет учеников для grade={grade}.
            </Alert>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Имя</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Класс</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Статус</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900 }}>Действия</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell sx={{ fontWeight: 800 }}>
                        {s.fullName || s.name || `Student #${s.id}`}
                      </TableCell>
                      <TableCell>{s.email || "—"}</TableCell>
                      <TableCell>{s.grade ?? grade}</TableCell>
                      <TableCell>
                        {calcRisk(s) === "unknown" ? (
                          <Chip label="—" size="small" variant="outlined" />
                        ) : null}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => openProgress(s)}
                        >
                          Прогресс
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 520 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Прогресс ученика
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedStudent?.fullName || selectedStudent?.email || "—"}
          </Typography>

          {progressLoading ? <LinearProgress sx={{ mt: 2 }} /> : null}

          <Box sx={{ mt: 2 }}>
            <StudentProgressCards items={progressItems} />
          </Box>

          <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="outlined"
            onClick={() => setDrawerOpen(false)}
          >
            Закрыть
          </Button>
        </Box>
      </Drawer>
    </Stack>
  );
}