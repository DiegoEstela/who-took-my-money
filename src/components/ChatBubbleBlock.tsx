import { Typography, useTheme, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import evaImg from "../assets/eva.png";
import React from "react";

interface ChatBubbleBlockProps {
  text: string | React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  evaSize?: number;
  imagePosition?: "left" | "right" | "top";
  fontSize?: number;
  sx?: any; // 🔹 Agregamos la prop sx para permitir estilos personalizados
}

const ChatBubbleBlock = ({
  text,
  buttonText,
  onButtonClick,
  evaSize = 60,
  imagePosition = "top",
  fontSize = 16,
  sx = {}, // 🔹 Valor por defecto
}: ChatBubbleBlockProps) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Box sx={{ ...styles.chatBubble(theme, imagePosition), ...sx }}>
        {imagePosition !== "right" && (
          <Box
            component="img"
            src={evaImg}
            alt="eva"
            sx={{ ...styles.image, width: evaSize, height: evaSize }}
          />
        )}

        <Box sx={styles.textContainer}>
          <Typography variant="body1" textAlign="center" sx={{ fontSize }}>
            {text}
          </Typography>

          {buttonText && onButtonClick && (
            <Button variant="contained" onClick={onButtonClick} sx={{ mt: 2 }}>
              {buttonText}
            </Button>
          )}
        </Box>

        {imagePosition === "right" && (
          <Box
            component="img"
            src={evaImg}
            alt="eva"
            sx={{ ...styles.image, width: evaSize, height: evaSize }}
          />
        )}
      </Box>
    </motion.div>
  );
};

const styles = {
  chatBubble: (theme: any, imagePosition: string) => ({
    display: "flex",
    flexDirection: imagePosition === "top" ? "column" : "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.3)",
    color: theme.palette.text.primary,
    minWidth: "300px",
    textAlign: "center",
    width: "100%",
    marginTop: "0px",
    padding: "8px",
    position: "absolute",
    transform: "translateX(-50%)",
    zIndex: 10,
  }),
  image: {
    marginBottom: "-5px",
    marginRight: "8px",
    marginLeft: "8px",
  },
  textContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "8px",
    textAlign: "center",
    flex: 1,
  },
};

export default ChatBubbleBlock;
