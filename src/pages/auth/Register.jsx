import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../shared/auth/AuthContext";
import { useNotify } from "../../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../../shared/api/apiClient";
import PasswordStrength from "../../shared/ui/PasswordStrength";

export default function Register() {
  const { t } = useTranslation();
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
      notify(t("register.success"), "success");
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
          {t("register.title")}
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2 }} component="form" onSubmit={onSubmit}>
          <ToggleButtonGroup
            exclusive
            value={role}
            onChange={(_, v) => v && setRole(v)}
            sx={{ alignSelf: "flex-start" }}
          >
            <ToggleButton value="STUDENT">{t("register.roleStudent")}</ToggleButton>
            <ToggleButton value="TEACHER">{t("register.roleTeacher")}</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label={t("register.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label={t("register.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            fullWidth
          />

          <TextField
            label={t("register.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            fullWidth
            helperText={t("register.passwordHint")}
          />

          <PasswordStrength password={password} />

          <TextField
            label={t("register.grade")}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            fullWidth
            disabled={gradeDisabled}
            helperText={
              gradeDisabled
                ? t("register.gradeTeacherHint")
                : t("register.gradeStudentHint")
            }
          />

          <Button
            type="submit"
            fullWidth
            color="secondary"
            disabled={submitting || !name || !email || password.length < 6}
          >
            {submitting ? t("register.loading") : t("register.submit")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}