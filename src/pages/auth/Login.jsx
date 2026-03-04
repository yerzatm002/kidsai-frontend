import React from "react";
import { Card, CardContent, Typography, Stack, TextField, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../shared/auth/AuthContext";
import { useNotify } from "../../shared/ui/notifications/NotificationsProvider";
import { normalizeApiError } from "../../shared/api/apiClient";

export default function Login() {
  const { login } = useAuth();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const from = location.state?.from || "/me";

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
      notify("Успешный вход!", "success");
      navigate(from, { replace: true });
    } catch (e2) {
      const err = normalizeApiError(e2);
      notify(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Войти
        </Typography>

        <Stack component="form" onSubmit={onSubmit} spacing={1.5} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            fullWidth
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            fullWidth
          />

          <Button type="submit" fullWidth disabled={submitting || !email || !password}>
            {submitting ? "Входим..." : "Войти"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}