import { useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import ChatBubble from "../../components/ChatBubble";
import useFinancialProfile from "../../hooks/useFinancialProfile";
import { getArturoTexts } from "../../utils/arturoTexts";

interface StepFinishProps {
  onBack: () => void;
  getValues: () => any;
  handleSaveToDB: () => void;
}

const StepFinish = ({ getValues, handleSaveToDB }: StepFinishProps) => {
  const ARTURO_TEXT = getArturoTexts();
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [showBubble, setShowBubble] = useState(true);

  const salary = getValues().salary || 0;
  const currency = getValues().currency || "";
  const fixedExpenses = getValues().fixedExpenses || {};
  const variableExpenses = getValues().variableExpenses || {};
  const { mensajeArturo } = useFinancialProfile(variableExpenses);

  const totalFixedExpenses = fixedExpenses.totalExpenses || 0;
  const totalVariableExpenses: any = Object.values(variableExpenses).reduce(
    (sum, exp: any) => sum + exp.amount,
    0
  );

  // 🔹 Primer mensaje: El perfil financiero del usuario
  const firstMessage: React.ReactNode = (
    <Box textAlign="center">{mensajeArturo}</Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color={theme.palette.customColors.black}
      >
        Resumen Final 🏆
      </Typography>

      <Box sx={{ textAlign: "left", width: "100%", maxWidth: "400px" }}>
        <Typography variant="body1" color={theme.palette.customColors.black}>
          <b>💰 Ingresos:</b> {currency} {salary.toLocaleString("es-ES")}
        </Typography>
        <Typography variant="body1" color={theme.palette.customColors.black}>
          <b>📌 Gastos Fijos:</b> {currency}{" "}
          {totalFixedExpenses.toLocaleString("es-ES")}
        </Typography>
        <Typography variant="body1" color={theme.palette.customColors.black}>
          <b>🎯 Gastos Variables:</b>
          {currency}
          {totalVariableExpenses.toLocaleString("es-ES")}
        </Typography>
      </Box>

      {/* Burbuja de Arturo con dos mensajes diferentes */}
      {showBubble && (
        <ChatBubble
          text={step === 1 ? firstMessage : ARTURO_TEXT.ONBOARDING.STEP6}
          buttonText={step === 1 ? "Siguiente" : "Salir"}
          onButtonClick={() => {
            if (step === 1) {
              setStep(2); // Avanzamos al segundo mensaje
            } else {
              setShowBubble(false); // Ocultamos la burbuja al finalizar
            }
          }}
          isVisible={true}
        />
      )}

      {/* Botón de Finalizar solo aparece cuando la burbuja desaparece */}
      {!showBubble && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveToDB}
          sx={{ mt: 2 }}
        >
          Finalizar
        </Button>
      )}
    </Box>
  );
};

export default StepFinish;
