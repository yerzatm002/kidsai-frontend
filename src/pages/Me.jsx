import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";

export default function Me() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Добро пожаловать, {user.fullName}!
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
            <Chip label={`Role: ${user.role}`} />
            {user.grade ? <Chip label={`Grade: ${user.grade}`} color="secondary" /> : null}
            {typeof user.level !== "undefined" ? <Chip label={`Level: ${user.level}`} color="success" /> : null}
            {typeof user.xp !== "undefined" ? <Chip label={`XP: ${user.xp}`} /> : null}
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2 }}>
            {user.role === "TEACHER" ? (
              <Button onClick={() => navigate("/teacher")} color="secondary">
                Перейти в кабинет учителя
              </Button>
            ) : (
              <Button onClick={() => navigate("/courses")}>К курсам</Button>
            )}

            <Button variant="outlined" color="error" onClick={logout}>
              Выйти
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}