import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./shared/i18n/i18n";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./shared/theme/theme";
import NotificationsProvider from "./shared/ui/notifications/NotificationsProvider";
import AuthProvider from "./shared/auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <NotificationsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificationsProvider>
    </ThemeProvider>
  </React.StrictMode>
);