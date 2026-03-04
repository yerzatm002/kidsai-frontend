import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox
} from "@mui/material";

export default function QuestionCard({ question, selected, onChange }) {
  const type = question.type; // SINGLE | MULTI
  const options = question.options || [];
  const prompt = question.prompt || "";

  return (
    <Card sx={{ bgcolor: "rgba(47,128,237,0.04)" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
          {prompt}
        </Typography>

        {type === "SINGLE" ? (
          <RadioGroup
            value={selected?.[0] ?? ""}
            onChange={(e) => onChange([Number(e.target.value)])}
          >
            {options.map((opt, idx) => (
              <FormControlLabel
                key={idx}
                value={idx}
                control={<Radio />}
                label={<Typography sx={{ fontSize: "1.05rem" }}>{opt}</Typography>}
              />
            ))}
          </RadioGroup>
        ) : (
          <Box sx={{ display: "grid", gap: 1 }}>
            {options.map((opt, idx) => {
              const checked = (selected || []).includes(idx);
              return (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => {
                        const next = new Set(selected || []);
                        if (e.target.checked) next.add(idx);
                        else next.delete(idx);
                        onChange(Array.from(next).sort((a, b) => a - b));
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: "1.05rem" }}>{opt}</Typography>}
                />
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}