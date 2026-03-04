import React from "react";
import { Card, CardContent, CardMedia, Typography, Stack, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function TopicCard({ topic }) {
  const title = topic?.title || "—";
  const description = topic?.description || "";
  const cover = topic?.coverImageUrl || null;

  return (
    <Card sx={{ overflow: "hidden" }}>
      {cover ? (
        <CardMedia component="img" height="140" image={cover} alt={title} loading="lazy" />
      ) : (
        <CardMedia
          component="div"
          sx={{
            height: 140,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(47,128,237,0.10)"
          }}
        >
          <AutoAwesomeIcon fontSize="large" />
        </CardMedia>
      )}

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 54
          }}
        >
          {description}
        </Typography>

        <Stack sx={{ mt: 1.5 }}>
          <Button component={RouterLink} to={`/topics/${topic.id}`} fullWidth>
            Открыть
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}