import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  Rating,
  Chip
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";

import { createFeedback } from "../../shared/api/feedbackApi";
import { normalizeApiError } from "../../shared/api/apiClient";

export default function FeedbackForm({ topicId, lessonId = null, onCreated }) {
  const { t } = useTranslation();

  const [rating, setRating] = React.useState(5);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [successInfo, setSuccessInfo] = React.useState(null); // {status, createdAt, id}
  const [errorText, setErrorText] = React.useState("");

  const validate = () => {
    const m = message.trim();
    if (!m) return t("feedback.errors.required");
    if (m.length < 5) return t("feedback.errors.tooShort");
    return "";
  };

  const submit = async () => {
    setErrorText("");
    const v = validate();
    if (v) {
      setErrorText(v);
      return;
    }
    if (!topicId) {
      setErrorText("topicId is required");
      return;
    }

    setLoading(true);
    try {
      const res = await createFeedback({
        topicId,
        lessonId,
        rating: Number(rating || 0),
        message: message.trim()
      });

      // ответ 201: { feedback: { id, status, createdAt } } :contentReference[oaicite:3]{index=3}
      const fb = res?.feedback;
      setSuccessInfo({
        id: fb?.id,
        status: fb?.status,
        createdAt: fb?.createdAt
      });

      setMessage("");
      onCreated?.(fb);
    } catch (e) {
      const err = normalizeApiError(e);
      setErrorText(err.message || t("feedback.errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 4, bgcolor: "rgba(47,128,237,0.04)" }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("feedback.title")}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {t("feedback.subtitle")}
        </Typography>

        {successInfo ? (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 3 }}>
            {t("feedback.thanks")}
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {successInfo.status ? (
                <Chip label={`${t("feedback.status")}: ${successInfo.status}`} size="small" />
              ) : null}
              {successInfo.createdAt ? (
                <Chip
                  label={`${t("feedback.created")}: ${new Date(successInfo.createdAt).toLocaleString()}`}
                  size="small"
                />
              ) : null}
              {successInfo.id ? <Chip label={`ID: ${successInfo.id}`} size="small" /> : null}
            </Stack>
          </Alert>
        ) : null}

        {errorText ? (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>
            {errorText}
          </Alert>
        ) : null}

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ fontWeight: 800 }}>{t("feedback.rating")}</Typography>
            <Rating
              value={rating}
              onChange={(_, v) => setRating(v || 0)}
              size="large"
            />
          </Stack>

          <TextField
            label={t("feedback.message")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("feedback.placeholder")}
            multiline
            minRows={3}
            fullWidth
          />

          <Button
            onClick={submit}
            disabled={loading}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ fontWeight: 900, borderRadius: 3, py: 1.25 }}
          >
            {t("feedback.send")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}