import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./AuthContext";

export function RequireAuth({ children }) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function RequireRole({ role, children }) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  if (!user || user.role !== role) {
    // если роль не та — отправляем в кабинет
    return <Navigate to="/me" replace />;
  }

  return children;
}