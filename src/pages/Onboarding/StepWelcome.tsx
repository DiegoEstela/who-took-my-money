import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ChatBubble from "../../components/ChatBubble";
import { getEvaTexts } from "../../utils/getEvaTexts";

const StepWelcome = ({ onNext }: { onNext: () => void }) => {
  const { register, watch } = useFormContext();
  const name = watch("name", "");
  const [showBubble, setShowBubble] = useState(true);
  const EVA_TEXT = getEvaTexts();

  return (
    <Box textAlign="center">
      <ChatBubble
        text={EVA_TEXT.ONBOARDING.STEP1}
        onButtonClick={() => setShowBubble(false)}
        isVisible={showBubble}
        buttonText="Empezar"
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
