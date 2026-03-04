import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function TeacherHome() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Кабинет учителя
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Здесь будут управление темами, уроками, заданиями и тестами.
        </Typography>
      </CardContent>
    </Card>
  );
}