import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { registerUser, loginUser } from "../services/authService";
import { useNotification } from "../context/useNotification";

interface AuthFormProps {
  isRegister: boolean;
  onSuccess: () => void;
}

const AuthForm = ({ isRegister, onSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
        showNotification("success", "Inicio de sesión exitoso");
      }
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        showNotification("error", err.message);
      } else {
        showNotification("error", "Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <Box>
      <TextField
        label="Correo Electrónico"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Contraseña"
        type="password"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{
          bgcolor: "#6200ea",
          "&:hover": { bgcolor: "#4b00b5" },
          marginBottom: 2,
        }}
        onClick={handleSubmit}
      >
        {isRegister ? "Registrarse" : "Iniciar Sesión"}
      </Button>
    </Box>
  );
};

export default AuthForm;
