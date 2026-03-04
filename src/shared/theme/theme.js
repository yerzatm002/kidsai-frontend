import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#EAF6FF",
      paper: "#FFFFFF"
    },
    primary: {
      main: "#2F80ED"
    },
    secondary: {
      main: "#F2994A"
    },
    success: {
      main: "#27AE60"
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Arial",
      "sans-serif"
    ].join(","),
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    button: { fontWeight: 700, textTransform: "none" }
  },
  components: {
    MuiButton: {
      defaultProps: { size: "large", variant: "contained" },
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingLeft: 16,
          paddingRight: 16
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }
      }
    }
  }
});