import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6200ea" }, // Púrpura moderno
    secondary: { main: "#03dac6" }, // Verde agua
    background: { default: "#f4f4f4" }, // Fondo más claro
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
