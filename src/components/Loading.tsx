import { CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,rgb(26, 133, 124),rgb(56, 195, 181))",
        color: "white",
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} sx={{ color: "#FFD700" }} />{" "}
      {/* Carga dorada */}
      <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
        Cargando...
      </Typography>
    </motion.div>
  );
};

export default Loading;
