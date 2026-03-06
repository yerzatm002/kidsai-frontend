import React from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Stack,
  Chip
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";

import { useTranslation } from "react-i18next";
import LanguageSwitch from "../../features/language/LanguageSwitch";
import { useAuth } from "../../shared/auth/AuthContext";
import LevelChip from "../../shared/ui/gamification/LevelChip";

function NavButton({ to, label, active }) {
  return (
    <Button
      component={RouterLink}
      to={to}
      variant={active ? "contained" : "text"}
      color={active ? "primary" : "inherit"}
      sx={{
        borderRadius: 999,
        fontWeight: 900,
        px: 1.5,
        bgcolor: active ? "rgba(47,128,237,0.18)" : "transparent",
        color: "text.primary"
      }}
    >
      {label}
    </Button>
  );
}

export default function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const path = location.pathname;

  const navItems = [
    { to: "/", key: "nav.home" },
    { to: "/courses", key: "nav.courses" },
    { to: "/about", key: "nav.about" },
    { to: "/faq", key: "nav.faq" },
    { to: "/security", key: "nav.security" },
    { to: "/contact", key: "nav.contact" }
  ];

  const isActive = (to) => {
    if (to === "/") return path === "/";
    return path.startsWith(to);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(234,246,255,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)"
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              color: "inherit",
              textDecoration: "none"
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "white"
              }}
            >
              <AutoAwesomeIcon />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 900, color: "text.primary" }}>
              {t("appName")}
            </Typography>

            <Chip
              icon={<SchoolIcon />}
              label="5–6"
              size="small"
              sx={{ ml: 1, bgcolor: "rgba(47,128,237,0.12)" }}
            />
          </Box>

          {/* NAV (desktop/tablet) */}
          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ ml: 2 }}>
              {navItems.map((it) => (
                <NavButton key={it.to} to={it.to} label={t(it.key)} active={isActive(it.to)} />
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, display: { xs: "block", md: "none" } }} />

          {/* Right actions */}
          <Stack direction="row" spacing={1.25} alignItems="center">
            <LevelChip />
            <LanguageSwitch />

            {!isAuthenticated ? (
              <>
                <Button component={RouterLink} to="/auth/login" variant="outlined" sx={{ fontWeight: 900 }}>
                  {t("auth.login")}
                </Button>
                <Button
                  component={RouterLink}
                  to="/auth/register"
                  color="secondary"
                  variant="contained"
                  sx={{ fontWeight: 900 }}
                >
                  {t("auth.register")}
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ fontWeight: 800, mr: 1, color: "text.primary", display: { xs: "none", sm: "block" } }}>
                  {t("auth.hello", { name: user?.fullName || "—" })}
                </Typography>

                <Button component={RouterLink} to="/me" variant="outlined" sx={{ fontWeight: 900 }}>
                  {t("nav.cabinet")}
                </Button>

                {user?.role === "TEACHER" ? (
                  <>
                    <Button component={RouterLink} to="/teacher/content" variant="outlined" sx={{ fontWeight: 900 }}>
                      {t("teacher.content")}
                    </Button>
                    <Button component={RouterLink} to="/teacher/students" variant="outlined" sx={{ fontWeight: 900 }}>
                      {t("teacher.students")}
                    </Button>
                    <Button component={RouterLink} to="/teacher/feedback" variant="outlined" sx={{ fontWeight: 900 }}>
                      {t("teacher.feedback")}
                    </Button>
                  </>
                ) : null}

                <Button onClick={logout} color="error" variant="contained" sx={{ fontWeight: 900 }}>
                  {t("auth.logout")}
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>

        {/* NAV (mobile) */}
        <Box sx={{ display: { xs: "block", md: "none" }, px: 2, pb: 1.5 }}>
          <Stack direction="row" spacing={0.75} sx={{ overflowX: "auto", pb: 0.5 }}>
            {navItems.map((it) => (
              <NavButton key={it.to} to={it.to} label={t(it.key)} active={isActive(it.to)} />
            ))}
          </Stack>
        </Box>
      </AppBar>

      <Container sx={{ pb: { xs: 2.5, md: 4 }, pt: { xs: 2, md: 3 }, flex: 1 }}>
        <Outlet />
      </Container>

      <Box sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="body2">© {new Date().getFullYear()} KidsAI</Typography>
      </Box>
    </Box>
  );
}