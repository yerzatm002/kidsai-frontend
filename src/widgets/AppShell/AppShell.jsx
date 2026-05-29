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
  Chip,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
        color: "text.primary",
        whiteSpace: "nowrap"
      }}
    >
      {label}
    </Button>
  );
}

function MobileNavItem({ to, label, active, onClick }) {
  return (
    <ListItemButton
      component={RouterLink}
      to={to}
      onClick={onClick}
      selected={active}
      sx={{
        borderRadius: 3,
        mb: 0.5,
        "&.Mui-selected": {
          bgcolor: "rgba(47,128,237,0.14)"
        }
      }}
    >
      <ListItemText
        primary={label}
        primaryTypographyProps={{ fontWeight: 900 }}
      />
    </ListItemButton>
  );
}

export default function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const path = location.pathname;

  const navItems = [
    { to: "/", key: "nav.home" },
    { to: "/courses", key: "nav.courses" },
    { to: "/about", key: "nav.about" },
    { to: "/faq", key: "nav.faq" },
    { to: "/security", key: "nav.security" },
    { to: "/contact", key: "nav.contact" }
  ];

  const teacherItems = [
    { to: "/teacher/content", key: "teacher.content" },
    { to: "/teacher/students", key: "teacher.students" },
    { to: "/teacher/feedback", key: "teacher.feedback" }
  ];

  const isActive = (to) => {
    if (to === "/") return path === "/";
    return path.startsWith(to);
  };

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(234,246,255,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)"
        }}
      >
        <Toolbar sx={{ gap: 1.25, minHeight: { xs: 64, md: 72 } }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            aria-label="open navigation"
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "inherit",
              textDecoration: "none",
              minWidth: 0
            }}
          >
            <Box
              sx={{
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "white",
                flexShrink: 0
              }}
            >
              <AutoAwesomeIcon fontSize="small" />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                display: { xs: "none", sm: "block" }
              }}
            >
              {t("appName")}
            </Typography>

            <Chip
              icon={<SchoolIcon />}
              label="5–6"
              size="small"
              sx={{
                ml: { xs: 0, md: 0.5 },
                bgcolor: "rgba(47,128,237,0.12)",
                display: { xs: "none", sm: "inline-flex" }
              }}
            />
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 1 }}>
              {navItems.map((it) => (
                <NavButton
                  key={it.to}
                  to={it.to}
                  label={t(it.key)}
                  active={isActive(it.to)}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, display: { xs: "block", md: "none" } }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <LevelChip />
            </Box>

            <LanguageSwitch />

            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {!isAuthenticated ? (
                <Stack direction="row" spacing={1}>
                  <Button component={RouterLink} to="/auth/login" variant="outlined" sx={{ fontWeight: 900 }}>
                    {t("auth.login")}
                  </Button>
                  <Button component={RouterLink} to="/auth/register" color="secondary" variant="contained" sx={{ fontWeight: 900 }}>
                    {t("auth.register")}
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontWeight: 800, color: "text.primary" }}>
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
                </Stack>
              )}
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{
          sx: {
            width: 300,
            maxWidth: "86vw",
            bgcolor: "#EAF6FF"
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "white"
              }}
            >
              <AutoAwesomeIcon />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900 }}>{t("appName")}</Typography>
              <Typography variant="body2" color="text.secondary">
                5–6
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            {navItems.map((it) => (
              <MobileNavItem
                key={it.to}
                to={it.to}
                label={t(it.key)}
                active={isActive(it.to)}
                onClick={closeMobile}
              />
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {!isAuthenticated ? (
            <Stack spacing={1}>
              <Button component={RouterLink} to="/auth/login" onClick={closeMobile} variant="outlined" fullWidth>
                {t("auth.login")}
              </Button>
              <Button component={RouterLink} to="/auth/register" onClick={closeMobile} color="secondary" variant="contained" fullWidth>
                {t("auth.register")}
              </Button>
            </Stack>
          ) : (
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 900 }}>
                {t("auth.hello", { name: user?.fullName || "—" })}
              </Typography>

              <Box>
                <LevelChip />
              </Box>

              <Button component={RouterLink} to="/me" onClick={closeMobile} variant="outlined" fullWidth>
                {t("nav.cabinet")}
              </Button>

              {user?.role === "TEACHER" ? (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 900 }}>
                    Teacher
                  </Typography>

                  {teacherItems.map((it) => (
                    <Button
                      key={it.to}
                      component={RouterLink}
                      to={it.to}
                      onClick={closeMobile}
                      variant="outlined"
                      fullWidth
                    >
                      {t(it.key)}
                    </Button>
                  ))}
                </>
              ) : null}

              <Button onClick={handleLogout} color="error" variant="contained" fullWidth>
                {t("auth.logout")}
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>

      <Container sx={{ pb: { xs: 2.5, md: 4 }, pt: { xs: 2, md: 3 }, flex: 1 }}>
        <Outlet />
      </Container>

      <Box sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="body2">© {new Date().getFullYear()} KidsAI</Typography>
      </Box>
    </Box>
  );
}