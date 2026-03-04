import React from "react";
import { Box, Skeleton } from "@mui/material";

export default function LazyImage({
  src,
  alt = "",
  height = 180,
  radius = 16,
  style = {}
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <Box sx={{ position: "relative", borderRadius: radius, overflow: "hidden" }}>
      {!loaded && !error ? <Skeleton variant="rectangular" height={height} /> : null}

      {src && !error ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: "100%",
            height,
            objectFit: "cover",
            display: loaded ? "block" : "none",
            ...style
          }}
        />
      ) : null}

      {error ? (
        <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: 14, color: "rgba(0,0,0,0.6)" }}>
            Изображение недоступно
          </span>
        </Box>
      ) : null}
    </Box>
  );
}