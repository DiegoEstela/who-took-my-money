import { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ChatBubble from "../../components/ChatBubble";

const StepWelcome = ({ onNext }: { onNext: () => void }) => {
  const { register, watch } = useFormContext();
  const name = watch("name", "");
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box textAlign="center">
      <ChatBubble
        text="¡Hola! Soy Arturo, tu asistente financiero. Antes de empezar, me gustaría saber cómo te llamas."
        onButtonClick={() => setShowBubble(false)}
        isVisible={showBubble}
      />
      <TextField
        {...register("name", { required: true })}
        label="Tu Nombre"
        variant="outlined"
        fullWidth
        sx={{ my: 2 }}
      />

      <Button variant="contained" onClick={onNext} disabled={!name.trim()}>
        Empezar
      </Button>
    </Box>
  );
};

export default StepWelcome;
