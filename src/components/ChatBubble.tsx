import { Typography, useTheme, Box } from "@mui/material";
import { motion } from "framer-motion";
import arturoImg from "../assets/arturo.png";

interface ChatBubbleProps {
  text: string;
}

const ChatBubble = ({ text }: ChatBubbleProps) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }} // Comienza completamente transparente
      animate={{ opacity: 1 }} // Se hace visible gradualmente
      transition={{ duration: 0.6, ease: "easeOut" }} // Transición suave
    >
      <Box sx={styles.chatBubble(theme)}>
        {/* Imagen de Arturo */}
        <Box component="img" src={arturoImg} alt="Arturo" sx={styles.image} />

        {/* Contenedor del texto */}
        <Box sx={styles.textContainer}>
          <Typography variant="body1" textAlign="center">
            {text}
          </Typography>
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
