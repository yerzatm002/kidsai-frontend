import React from "react";
import {
  Card, CardContent, Typography, Stack, TextField, Button,
  ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/auth/AuthContext";
import { useNotify } from "../../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../../shared/api/apiClient";
import PasswordStrength from "../../shared/ui/PasswordStrength";

export default function Register() {
  const { register } = useAuth();
  const { notify } = useNotify();
  const navigate = useNavigate();

  const [role, setRole] = React.useState("STUDENT");
  const [grade, setGrade] = React.useState("5");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({ name, email, password, role, grade });
      notify("Аккаунт создан! Добро пожаловать 🎉", "success");
      navigate("/me", { replace: true });
    } catch (e2) {
      const err = normalizeApiError(e2);
      notify(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const gradeDisabled = role !== "STUDENT";

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Регистрация
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2 }} component="form" onSubmit={onSubmit}>
          <ToggleButtonGroup
            exclusive
            value={role}
            onChange={(_, v) => v && setRole(v)}
            sx={{ alignSelf: "flex-start" }}
          >
            <ToggleButton value="STUDENT">Ученик</ToggleButton>
            <ToggleButton value="TEACHER">Учитель</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            fullWidth
          />

          <TextField
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            fullWidth
            helperText="Минимум 8 символов — лучше с цифрами и символами"
          />
          <PasswordStrength password={password} />

          <TextField
            label="Класс (5 или 6)"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            fullWidth
            disabled={gradeDisabled}
            helperText={gradeDisabled ? "Для учителя класс не требуется" : "Выберите 5 или 6"}
          />

          <Button
            type="submit"
            fullWidth
            color="secondary"
            disabled={submitting || !name || !email || password.length < 6}
          >
            {submitting ? "Создаём..." : "Создать аккаунт"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}