import React from "react";
import {
  Box,
  Fab,
  Drawer,
  Stack,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  Divider,
  CircularProgress
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";
import { aiHelp } from "../../shared/api/aiApi";
import { normalizeApiError } from "../../shared/api/apiClient";

const MAX_SNIPPET_CHARS = 700;   // safety + payload size
const MAX_QUESTION_CHARS = 240;  // детский короткий вопрос

function sanitizeSnippet(s) {
  const text = String(s || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.slice(0, MAX_SNIPPET_CHARS);
}

// очень простая client-side safety защита (основное — на backend) :contentReference[oaicite:3]{index=3}
function looksLikePersonalData(q) {
  const s = String(q || "");
  // email, phone, @handles — чтобы не отправлять ПДн детей
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phone = /(\+?\d[\d\s()-]{7,}\d)/;
  const handle = /@\w{3,}/;
  return email.test(s) || phone.test(s) || handle.test(s);
}

function buildFallbackAnswer(t) {
  const tips = t("ai.fallbackTips", { returnObjects: true });
  return `${t("ai.errors.offline")}\n\n• ${tips.join("\n• ")}`;
}

export default function AiFloatingWidget({
  topicId,
  lessonSnippet,
  // mode можно задавать извне, но обычно выбираем кнопками:
}) {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [messages, setMessages] = React.useState([
    { role: "assistant", text: t("ai.subtitle") }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [banner, setBanner] = React.useState(null);

  // quick buttons -> mode
  const askQuick = async (mode) => {
    const q =
      mode === "explain" ? t("ai.quick.simpler") :
      mode === "example" ? t("ai.quick.example") :
      t("ai.quick.check");

    await send(q, mode);
  };

  const send = async (qRaw, mode) => {
    const q = String(qRaw || "").trim().slice(0, MAX_QUESTION_CHARS);
    if (!q) return;

    // safety: не отправляем ПДн
    if (looksLikePersonalData(q)) {
      setBanner({ type: "warning", text: t("ai.errors.blocked") });
      setMessages((prev) => [...prev, { role: "assistant", text: t("ai.errors.blocked") }]);
      return;
    }

    setBanner(null);
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: q }]);

    try {
      // Важно: lang отправляем как ?lang= в контенте, а в AI — полем lang :contentReference[oaicite:4]{index=4}
      const payload = {
        topicId,
        mode, // explain|example|check (в доке пример mode="explain") :contentReference[oaicite:5]{index=5}
        lang: i18n.language === "kz" ? "kz" : "ru",
        question: q,
        lessonSnippet: sanitizeSnippet(lessonSnippet)
      };

      const res = await aiHelp(payload);

      // normal: blocked=false :contentReference[oaicite:6]{index=6}
      if (res?.blocked === false) {
        setMessages((prev) => [...prev, { role: "assistant", text: res.answer || "—" }]);
      } else {
        // fallback/blocked :contentReference[oaicite:7]{index=7}
        const text = res?.answer || t("ai.errors.blocked");
        setMessages((prev) => [...prev, { role: "assistant", text }]);
        setBanner({ type: "info", text: res?.fallback ? t("ai.errors.offline") : t("ai.errors.blocked") });
      }
    } catch (e) {
      // если AI упал/недоступен — делаем fallback (обязателен) :contentReference[oaicite:8]{index=8}
      const err = normalizeApiError(e);
      const fallbackText = buildFallbackAnswer(t);
      setBanner({ type: "info", text: err.message });
      setMessages((prev) => [...prev, { role: "assistant", text: fallbackText }]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <>
      <Fab
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 64,
          height: 64,
          borderRadius: 999,
          fontWeight: 900
        }}
        color="primary"
        aria-label="AI"
      >
        <AutoAwesomeIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 420 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" sx={{ fontWeight: 900, flex: 1 }}>
              {t("ai.title")}
            </Typography>
            <Button variant="outlined" onClick={() => setOpen(false)} startIcon={<CloseIcon />}>
              Close
            </Button>
          </Stack>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {t("ai.subtitle")}
          </Typography>

          {banner ? (
            <Alert severity={banner.type} sx={{ mt: 1.5, borderRadius: 3 }}>
              {banner.text}
            </Alert>
          ) : null}

          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
            <Chip label={t("ai.quick.simpler")} onClick={() => askQuick("explain")} />
            <Chip label={t("ai.quick.example")} onClick={() => askQuick("example")} />
            <Chip label={t("ai.quick.check")} onClick={() => askQuick("check")} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              height: "52vh",
              overflow: "auto",
              p: 1.25,
              borderRadius: 3,
              bgcolor: "rgba(47,128,237,0.06)",
              border: "1px solid rgba(0,0,0,0.06)"
            }}
          >
            <Stack spacing={1.25}>
              {messages.map((m, idx) => (
                <Box
                  key={idx}
                  sx={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "92%",
                    p: 1.25,
                    borderRadius: 3,
                    bgcolor: m.role === "user" ? "rgba(242,153,74,0.22)" : "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(0,0,0,0.06)"
                  }}
                >
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Stack spacing={1.25} sx={{ mt: 2 }}>
            <TextField
              label={t("ai.placeholder")}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              fullWidth
              disabled={loading}
              inputProps={{ maxLength: MAX_QUESTION_CHARS }}
            />

            <Button
              onClick={() => send(question, "explain")}
              disabled={loading || !topicId}
              sx={{ fontWeight: 900 }}
            >
              {loading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} />
                  <span>...</span>
                </Stack>
              ) : (
                t("ai.send")
              )}
            </Button>

            {!topicId ? (
              <Alert severity="warning" sx={{ borderRadius: 3 }}>
                topicId не задан — откройте тему/урок, чтобы AI работал корректно.
              </Alert>
            ) : null}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}