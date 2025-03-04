import { Typography, useTheme, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import arturoImg from "../assets/arturo.png";
import React from "react";

interface ChatBubbleProps {
  text: string | React.ReactNode; // 🔹 Permite string o JSX
  buttonText?: string;
  onButtonClick?: () => void;
}

const ChatBubble = ({ text, buttonText, onButtonClick }: ChatBubbleProps) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }} // Comienza completamente transparente
      animate={{ opacity: 1 }} // Se hace visible gradualmente
      transition={{ duration: 0.6, ease: "easeOut" }} // Transición suave
    >
      <Box sx={styles.chatBubble(theme)}>
        <Box component="img" src={arturoImg} alt="Arturo" sx={styles.image} />

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
            <Button variant="contained" onClick={onButtonClick} sx={{ mt: 2 }}>
              {buttonText}
            </Button>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

const styles = {
  chatBubble: (theme: any) => ({
    position: "fixed",
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
    color: theme.palette.text.primary,
    minWidth: "280px",
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
