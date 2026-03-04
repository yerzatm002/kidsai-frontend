import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import { setStoredLang } from "../../shared/i18n/i18n";

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const value = i18n.language === "ru" ? "ru" : "kz";

  const onChange = (_, next) => {
    if (!next) return;
    setStoredLang(next);
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        "& .MuiToggleButton-root": { border: 0, borderRadius: 3, px: 1.25 }
      }}
    >
      <ToggleButton value="kz">KZ</ToggleButton>
      <ToggleButton value="ru">RU</ToggleButton>
    </ToggleButtonGroup>
  );
}