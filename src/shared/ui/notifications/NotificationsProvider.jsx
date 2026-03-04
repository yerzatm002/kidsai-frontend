import React from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationsContext = React.createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useNotify() {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotify must be used within NotificationsProvider");
  return ctx;
}

export default function NotificationsProvider({ children }) {
  const [state, setState] = React.useState({
    open: false,
    severity: "info",
    message: ""
  });

  const notify = React.useCallback((message, severity = "info") => {
    setState({ open: true, severity, message });
  }, []);

  const close = () => setState((s) => ({ ...s, open: false }));

  return (
    <NotificationsContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={close} severity={state.severity} variant="filled" sx={{ borderRadius: 3 }}>
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationsContext.Provider>
  );
}