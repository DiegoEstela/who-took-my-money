import { Box } from "@mui/material";
import { ReactNode } from "react";

const BookBackground = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        height: "90vh",
        width: "92%",
        padding: "20px",
        background: "rgba(255, 255, 255, 0.85)", // 📌 Fondo semi-transparente simulando papel
        borderRadius: "15px",
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
        border: "2px solid #6B4226", // 📌 Bordes oscuros estilo libro antiguo
        position: "relative",
      }}
    >
      {children}
    </Box>
  );
};

export default BookBackground;
