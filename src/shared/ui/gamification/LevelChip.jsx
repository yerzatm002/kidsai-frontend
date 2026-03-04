import React from "react";
import { Chip } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";

export default function LevelChip() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const level = user?.level;
  if (user?.role !== "STUDENT") return null;
  if (typeof level === "undefined" || level === null) return null;

  return (
    <Chip
      icon={<AutoAwesomeIcon />}
      label={`${t("gami.level")}: ${level}`}
      color="secondary"
      sx={{ fontWeight: 900 }}
    />
  );
}