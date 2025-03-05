import { useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import ChatBubble from "../../components/ChatBubble";
import useFinancialProfile from "../../hooks/useFinancialProfile";

interface StepFinishProps {
  onBack: () => void;
  getValues: () => any;
  handleSaveToDB: () => void;
}

const StepFinish = ({ getValues, handleSaveToDB }: StepFinishProps) => {
  const theme = useTheme();
  const [step, setStep] = useState(1); // 🔹 Controla los pasos de los mensajes
  const [showBubble, setShowBubble] = useState(true); // 🔹 Maneja la visibilidad de la burbuja

  const name = getValues().name || "Usuario";
  const salary = getValues().salary || 0;
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

  // 🔹 Segundo mensaje: Explicación de cómo seguir
  const secondMessage: React.ReactNode = (
    <Box textAlign="center">
      <Typography variant="h6" fontWeight="bold">
        ¿Y ahora qué sigue? 🤔
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "8px", fontSize: "15px" }}>
        Ahora es momento de <strong>registrar cada uno de tus gastos</strong> en
        las categorías que definimos.
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "8px" }}>
        Al final de cada mes, <strong>recibirás un informe detallado</strong> en
        tu correo 📩 con un resumen de cómo administraste tu dinero, las
        categorías más gastadas y sugerencias para mejorar. 📊✨
      </Typography>
      <Typography
        variant="body1"
        sx={{ marginTop: "12px", fontWeight: "bold" }}
      >
        ¡Empieza a registrar tus gastos y toma el control de tus finanzas! 🚀
      </Typography>
    </Box>
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
          <b>💰 Ingresos:</b> ${salary.toLocaleString("es-ES")}
        </Typography>
        <Typography variant="body1" color={theme.palette.customColors.black}>
          <b>📌 Gastos Fijos:</b> ${totalFixedExpenses.toLocaleString("es-ES")}
        </Typography>
        <Typography variant="body1" color={theme.palette.customColors.black}>
          <b>🎯 Gastos Variables:</b> $
          {totalVariableExpenses.toLocaleString("es-ES")}
        </Typography>
      </Box>

      {/* Burbuja de Arturo con dos mensajes diferentes */}
      {showBubble && (
        <ChatBubble
          text={step === 1 ? firstMessage : secondMessage}
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
