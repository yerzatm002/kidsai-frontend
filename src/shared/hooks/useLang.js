import { useTranslation } from "react-i18next";
import React from "react";

export function useLang() {
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language === "ru" ? "ru" : "kz");

  React.useEffect(() => {
    const onChange = (lng) => setLang(lng === "ru" ? "ru" : "kz");
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, [i18n]);

  return lang;
}