import React from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Chip
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";
import { useTranslation } from "react-i18next";
// import { setAppLanguage } from "../../shared/i18n/i18n";
import { Alert, Collapse, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useHealth } from "../../shared/hooks/useHealth";
import LanguageSwitch from "../../features/language/LanguageSwitch";
import { useAuth } from "../../shared/auth/AuthContext";
import LevelChip from "../../shared/ui/gamification/LevelChip";

export default function AppShell() {
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { loading, ok, lastCheckedAt, recheck } = useHealth(20000);
//   const lang = i18n.language === "ru" ? "ru" : "kz";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" elevation={0} sx={{ background: "rgba(234,246,255,0.85)", backdropFilter: "blur(10px)" }}>
        <Toolbar>
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: "flex", alignItems: "center", gap: 1.25, color: "inherit", textDecoration: "none" }}
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

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1.25} alignItems="center">
            <LevelChip />
            <LanguageSwitch />

            {!isAuthenticated ? (
              <>
                <Button component={RouterLink} to="/auth/login" variant="outlined">
                  Войти
                </Button>
                <Button component={RouterLink} to="/auth/register" color="secondary" variant="contained">
                  Регистрация
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ fontWeight: 800, mr: 1, color: "text.primary" }}>
                  Привет, {user?.fullName}!
                </Typography>
                <Button component={RouterLink} to="/me" variant="outlined">
                  Кабинет
                </Button>
                {user?.role === "TEACHER" ? (
                  <Button component={RouterLink} to="/teacher" color="secondary" variant="outlined">
                    Учитель
                  </Button>
                ) : null}
                <Button onClick={logout} color="error" variant="contained">
                  Выйти
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

            <Container sx={{ pt: 2 }}>
        <Collapse in={!loading && !ok}>
          <Alert
            severity="warning"
            variant="filled"
            sx={{ borderRadius: 3, mb: 2 }}
            action={
              <Tooltip title="Проверить снова">
                <IconButton color="inherit" size="small" onClick={recheck}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            Сервис временно недоступен. Попробуйте позже.
          </Alert>
        </Collapse>

        {/* Dev-строка статуса можно оставить (аккуратно) */}
        <Collapse in>
          <Alert
            severity={ok ? "success" : "info"}
            sx={{ borderRadius: 3, mb: 2, bgcolor: "rgba(255,255,255,0.7)" }}
            icon={false}
          >
            Backend: {loading ? "checking..." : ok ? "OK" : "DOWN"}
            {lastCheckedAt ? ` • ${lastCheckedAt.toLocaleTimeString()}` : ""}
          </Alert>
        </Collapse>
      </Container>

      <Container sx={{ pb: { xs: 2.5, md: 4 }, flex: 1 }}>
        <Outlet />
      </Container>

      <Box sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="body2">© {new Date().getFullYear()} KidsAI</Typography>
      </Box>
    </Box>
  );
}