import { Typography, useTheme, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import evaImg from "../assets/eva.png";
import React from "react";

interface ChatBubbleProps {
  text: string | React.ReactNode; // 🔹 Permite string o JSX
  buttonText?: string;
  onButtonClick?: () => void;
  isVisible: boolean; // 🔹 Controla si la burbuja aparece con overlay
}

const ChatBubble = ({
  text,
  buttonText,
  onButtonClick,
  isVisible,
}: ChatBubbleProps) => {
  const theme = useTheme();

  if (!isVisible) return null; // 🔹 No renderiza si isVisible es false

  return (
    <Box sx={styles.overlay}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box sx={styles.chatBubble(theme)}>
          <Box component="img" src={evaImg} alt="Eva" sx={styles.image} />

          <Box sx={styles.textContainer}>
            {typeof text === "string" ? (
              <Typography variant="body1" textAlign="center">
                {text}
              </Typography>
            ) : (
              <Typography variant="body1" textAlign="left" component="div">
                {text}
              </Typography>
            )}

            {buttonText && onButtonClick && (
              <Button
                variant="contained"
                onClick={onButtonClick}
                sx={{ mt: 2 }}
              >
                {buttonText}
              </Button>
            )}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 🔹 Oscurece el fondo
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // 🔹 Justo por debajo de la burbuja
  },
  chatBubble: (theme: any) => ({
    position: "fixed",
    top: "4vh",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: 2000,
    color: theme.palette.text.primary,
    minWidth: "80vw",
    textAlign: "center",
  }),
  image: {
    width: "60px",
    height: "60px",
    marginBottom: "-10px",
  },
  textContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
  },
};

export default ChatBubble;
