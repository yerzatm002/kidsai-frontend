import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";

export default function TeacherContentHome() {
  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Учительский кабинет — Контент
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Создавайте темы, уроки, задания и тесты.
          </Typography>

          <Button
            component={RouterLink}
            to="/teacher/content/new"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Создать тему (мастер)
          </Button>
        </CardContent>
      </Card>

      {/* Позже сюда добавите список тем учителя (если появится endpoint листинга). */}
    </Stack>
  );
}