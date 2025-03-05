import { useState, useEffect } from "react";
import { Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../db/firebase";
import logo from "../../assets/LogoApp.png";
import AuthForm from "../../components/authForm";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsKeyboardVisible(window.innerHeight < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: isKeyboardVisible ? "flex-start" : "center",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
        overflowY: isKeyboardVisible ? "auto" : "hidden",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: "20px",
          textAlign: "center",
          width: { xs: "90%", sm: 400 },
          maxWidth: "100%",
          borderRadius: 3,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
          background: "#ffffff",
          transition: "all 0.3s ease",
        }}
      >
        {!isKeyboardVisible && (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <img
              src={logo}
              alt="Who Took My Money"
              style={{ height: "120px", maxWidth: "100%" }}
            />
          </Box>
        )}

        <AuthForm isRegister={isRegister} onSuccess={() => navigate("/")} />

        <Button sx={{ mt: 2 }} onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Auth;
