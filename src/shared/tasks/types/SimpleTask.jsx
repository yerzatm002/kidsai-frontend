import React from "react";
import {
  Box, Button, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import { useTranslation } from "react-i18next";

export function SimpleTask({ task, onSubmit }) {
  const { t } = useTranslation();
  const options = task.payload?.options || [];
  const [value, setValue] = React.useState("");

  const canSubmit = value !== "";

  return (
    <Box>
      <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((opt, idx) => (
          <FormControlLabel
            key={idx}
            value={String(idx)}
            control={<Radio />}
            label={opt}
            sx={{ mb: 0.5 }}
          />
        ))}
      </RadioGroup>

      <Button
        disabled={!canSubmit}
        onClick={() => onSubmit({ selectedIndex: Number(value) })}
        variant="contained"
        size="large"
        sx={{ mt: 2, borderRadius: 3, fontWeight: 900 }}
        fullWidth
      >
        {t("tasks.submit")}
      </Button>
    </Box>
  );
}