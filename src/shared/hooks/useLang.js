import { useTranslation } from "react-i18next";

export function useLang() {
  const { i18n } = useTranslation();
  const l = (i18n.language || "kz").toLowerCase();

  if (l === "kk" || l === "kz") return "kz";
  return "ru";
}