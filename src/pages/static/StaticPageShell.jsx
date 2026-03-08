import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

export default function StaticPageShell({ title, subtitle, icon, children }) {
  return (
    <Stack spacing={2.5}>
      <Card
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(47,128,237,0.12), rgba(242,153,74,0.12))"
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            {icon ? (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(255,255,255,0.9)"
                }}
              >
                {icon}
              </Box>
            ) : null}

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {title}
              </Typography>
              {subtitle ? (
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>{children}</CardContent>
      </Card>
    </Stack>
  );
}