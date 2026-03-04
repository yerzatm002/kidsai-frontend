import React from "react";
import { Box, Typography, TextField, Card, CardContent } from "@mui/material";

export default function QATask({ task, onAnswerChange }) {
  const prompt = task.prompt || "";
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    onAnswerChange(null);
    setText("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
        {prompt}
      </Typography>

      <Card sx={{ bgcolor: "rgba(242,153,74,0.10)" }}>
        <CardContent>
          <TextField
            value={text}
            onChange={(e) => {
              const v = e.target.value;
              setText(v);
              // отправляем как { text: "..." }
              onAnswerChange(v.trim() ? { text: v } : null);
            }}
            placeholder="Напиши ответ коротко"
            fullWidth
            multiline
            minRows={2}
          />
        </CardContent>
      </Card>
    </Box>
  );
}