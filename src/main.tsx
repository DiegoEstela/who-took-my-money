import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme.ts";
import { Container } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          background:
            "linear-gradient(135deg,rgb(26, 133, 124),rgb(56, 195, 181))", // Mantiene el fondo de colores en desktop y mobile
        }}
      >
        <App />
      </Container>
    </ThemeProvider>
  </StrictMode>
);
