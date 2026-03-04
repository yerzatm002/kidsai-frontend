import React from "react";
import { Stack, Button, Typography, LinearProgress, Alert, Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ImageUploader({
  label = "Загрузить изображение",
  valueUrl = "",
  onFilePicked,      // (file) => void
  uploading = false,
  errorText = "",
  onRemove           // () => void
}) {
  return (
    <Stack spacing={1.25}>
      <Button component="label" variant="outlined" startIcon={<ImageIcon />}>
        {label}
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFilePicked(file);
          }}
        />
      </Button>

      {uploading ? <LinearProgress /> : null}

      {errorText ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {errorText}
        </Alert>
      ) : null}

      {valueUrl ? (
        <Box sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
          <img
            src={valueUrl}
            alt="preview"
            style={{ width: "100%", display: "block", maxHeight: 220, objectFit: "cover" }}
          />
          <Stack direction="row" spacing={1} sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Превью загруженного изображения
            </Typography>
            {onRemove ? (
              <Button size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={onRemove}>
                Удалить
              </Button>
            ) : null}
          </Stack>
        </Box>
      ) : null}
    </Stack>
  );
}