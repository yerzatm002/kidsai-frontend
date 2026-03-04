import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

function scorePassword(pw) {
  let s = 0;
  if (!pw) return 0;
  if (pw.length >= 8) s += 25;
  if (/[A-Z]/.test(pw)) s += 20;
  if (/[a-z]/.test(pw)) s += 20;
  if (/[0-9]/.test(pw)) s += 20;
  if (/[^A-Za-z0-9]/.test(pw)) s += 15;
  return Math.min(100, s);
}

function labelByScore(score) {
  if (score >= 80) return "Отличный пароль";
  if (score >= 55) return "Нормальный пароль";
  if (score >= 30) return "Слабый пароль";
  return "Очень слабый пароль";
}

export default function PasswordStrength({ password }) {
  const score = scorePassword(password);
  return (
    <Box sx={{ mt: 0.5 }}>
      <LinearProgress variant="determinate" value={score} sx={{ height: 8, borderRadius: 4 }} />
      <Typography variant="caption" color="text.secondary">
        {labelByScore(score)}
      </Typography>
    </Box>
  );
}