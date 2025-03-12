import { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@mui/material";
import ChatBubble from "../../components/ChatBubble";
import { getEvaTexts } from "../../utils/getEvaTexts";
import StepNavigationBtn from "../../components/StepNavigationBtn";

const StepSavings = ({ onNext, onBack, setValue, getValues }: any) => {
  const [showBubble, setShowBubble] = useState(true);
  const salary = getValues("salary") || 0;
  const recommendedSavings = Math.min(
    20,
    Math.max(10, Math.floor(((salary * 0.15) / salary) * 100))
  );
  const [savingsPercentage, setSavingsPercentage] = useState(
    getValues("savingsPercentage") || recommendedSavings
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 4500); // Desaparece en 4,5 segundos
    return () => clearTimeout(timer);
  }, []);

  const EVA_TEXT = getEvaTexts(
    "",
    0,
    {},
    "USD",
    0,
    0,
    savingsPercentage,
    salary
  );

  const handleChange = (event: any, newValue: any) => {
    console.log(event);
    setSavingsPercentage(newValue);
  };

  const handleCalculate = () => {
    const savingsAmount = (salary * savingsPercentage) / 100;
    setValue("savings", savingsAmount);
    onNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      {/* Burbuja de Eva con recomendación */}
      <ChatBubble text={EVA_TEXT.ONBOARDING.STEP7} isVisible={showBubble} />

      <Typography variant="h6" mt={2} color="primary">
        ¿Cuánto quieres ahorrar?
      </Typography>
      <Slider
        value={savingsPercentage}
        onChange={handleChange}
        aria-labelledby="savings-slider"
        valueLabelDisplay="on"
        step={1}
        min={0}
        max={50}
        sx={{ width: "80%", mt: 2 }}
      />
      <Typography variant="h6" color="primary">
        Ahorro: {savingsPercentage}% del salario
      </Typography>

      <StepNavigationBtn onBack={onBack} onNext={handleCalculate} />
    </Box>
  );
};

export default StepSavings;
