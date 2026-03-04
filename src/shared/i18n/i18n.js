import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import kz from "./locales/kz.json";
import ru from "./locales/ru.json";

export const LANG_STORAGE_KEY = "kidsai_lang";

export function getStoredLang() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return saved === "ru" || saved === "kz" ? saved : "kz";
}

export function setStoredLang(lang) {
  const safe = lang === "ru" ? "ru" : "kz";
  localStorage.setItem(LANG_STORAGE_KEY, safe);
  i18n.changeLanguage(safe);
  return safe;
}

export function getContentLang() {
  // Для контента используем тот же язык, что и UI, ограничивая kz/ru
  const l = i18n.language;
  return l === "ru" ? "ru" : "kz";
}

i18n.use(initReactI18next).init({
  resources: {
    kz: { translation: kz },
    ru: { translation: ru }
  },
  lng: getStoredLang(),
  fallbackLng: "kz",
  interpolation: { escapeValue: false }
});

export default i18n;