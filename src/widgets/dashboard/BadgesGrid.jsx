import React from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function BadgesGrid({ items }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 2
      }}
    >
      {list.map((b, idx) => (
        <Card key={`${b.code}-${idx}`} sx={{ bgcolor: "rgba(242,153,74,0.10)" }}>
          <CardContent>
            <Typography sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
              <EmojiEventsIcon /> {b.title || b.code}
            </Typography>

            <Chip
              sx={{ mt: 1 }}
              label={b.earnedAt ? new Date(b.earnedAt).toLocaleString() : "—"}
              size="small"
              variant="outlined"
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}