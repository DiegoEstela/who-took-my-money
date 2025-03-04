import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircle, Error, Warning } from "@mui/icons-material";

interface NotificationProps {
  type: "success" | "error" | "warning";
  text: string;
}

const NotificationPopup = ({ type, text }: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000); // Ahora se queda visible por 4 segundos
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const getNotificationStyle = () => {
    switch (type) {
      case "success":
        return { color: "#fff", borderColor: "#4CAF50", Icon: CheckCircle }; // Verde
      case "error":
        return { color: "#fff", borderColor: "#F44336", Icon: Error }; // Rojo
      case "warning":
        return { color: "#fff", borderColor: "#FF9800", Icon: Warning }; // Naranja
      default:
        return { color: "#fff", borderColor: "#333", Icon: Error };
    }
  };

  const { borderColor, Icon } = getNotificationStyle();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }} // Aparece desde arriba
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: "fixed",
        top: 0,
        transform: "translateX(-50%)", // Lo centra en la pantalla
        width: "80%", // Usa todo el ancho disponible
        maxWidth: "400px", // No se expande demasiado
        zIndex: 2000,
      }}
    >
      <Box
        sx={{
          border: "3px solid",
          borderColor: borderColor,
          background: "#fff",
          color: borderColor,
          padding: "12px 20px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
          fontWeight: "bold",
          justifyContent: "center",
          textAlign: "center",
          margin: "10px auto",
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
        <Typography variant="body1">{text}</Typography>
      </Box>
    </motion.div>
  );
};

export default NotificationPopup;
