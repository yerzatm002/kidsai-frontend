import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";

export default function StaticPageShell({ title, children }) {
  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>{children}</CardContent>
      </Card>
    </Stack>
  );
}