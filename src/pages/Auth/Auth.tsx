import { useState, useEffect } from "react";
import { Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../db/firebase";
import logo from "../../assets/LogoApp.png";
import AuthForm from "../../components/authForm";
import AuthButtons from "../../components/authButtons";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Redirigir al home si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <Paper
      elevation={5}
      sx={{
        padding: 4,
        textAlign: "center",
        width: { xs: "90%", sm: 400 },
        borderRadius: 3,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
        background: "#ffffff",
      }}
    >
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <img src={logo} alt="Who Took My Money" style={{ height: "150px" }} />
      </Box>

      <AuthForm isRegister={isRegister} onSuccess={() => navigate("/")} />
      <AuthButtons onSuccess={() => navigate("/")} />

      <Button sx={{ mt: 2 }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? "¿Ya tienes una? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </Button>
    </Paper>
  );
};

export default Auth;
