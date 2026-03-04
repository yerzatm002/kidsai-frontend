import React from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Card, CardContent } from "@mui/material";

export default function SimpleTask({ task, onAnswerChange }) {
  const prompt = task.prompt || "";
  const options = task.payload?.options || [];

  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    // при первом рендере — нет ответа
    onAnswerChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const onChange = (e) => {
    const v = e.target.value;
    setValue(v);

    // answerPayload — минимальный и универсальный формат
    onAnswerChange({ choice: v });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
        {prompt}
      </Typography>

      <Card sx={{ bgcolor: "rgba(47,128,237,0.05)" }}>
        <CardContent>
          <RadioGroup value={value} onChange={onChange}>
            {options.map((opt, idx) => {
              const label = typeof opt === "string" ? opt : (opt.label ?? `Option ${idx + 1}`);
              const val = typeof opt === "string" ? opt : (opt.value ?? String(idx));
              return (
                <FormControlLabel
                  key={idx}
                  value={val}
                  control={<Radio />}
                  label={<Typography sx={{ fontSize: "1.05rem" }}>{label}</Typography>}
                />
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    </Box>
  );
}