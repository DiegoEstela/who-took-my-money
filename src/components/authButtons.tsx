import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";
import { loginWithGoogle } from "../services/authService";

interface AuthButtonsProps {
  onSuccess: () => void; // Redirección después del login
}

const AuthButtons = ({ onSuccess }: AuthButtonsProps) => {
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onSuccess(); // Redirige después del éxito
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={handleGoogleLogin}
      startIcon={<Google />}
      sx={{
        color: "#333",
        borderColor: "#333",
        "&:hover": { backgroundColor: "#f5f5f5" },
      }}
    >
      Iniciar sesión con Google
    </Button>
  );
};

export default AuthButtons;
