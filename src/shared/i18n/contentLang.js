const LS_LANG_KEY = "kidsai_lang"; // тот же ключ, что в Этапе 3

export function getContentLang() {
  const v = localStorage.getItem(LS_LANG_KEY);
  return v === "ru" ? "ru" : "kz"; // default kz
}