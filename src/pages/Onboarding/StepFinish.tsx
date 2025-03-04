import { useState } from "react";
import { Box, Typography, Button, useTheme, Container } from "@mui/material";
import ChatBubble from "../../components/ChatBubble";

interface StepFinishProps {
  onBack: () => void;
  getValues: () => any;
  handleSaveToDB: () => void;
}

const StepFinish = ({ getValues, handleSaveToDB }: StepFinishProps) => {
  const theme = useTheme();
  const [showAdvice, setShowAdvice] = useState(false);
  const [adviceClosed, setAdviceClosed] = useState(false);

  const name = getValues().name || "Usuario";
  const salary = getValues().salary || 0;
  const fixedExpenses = getValues().fixedExpenses || {};
  const variableExpenses = getValues().variableExpenses || {};

  const totalFixedExpenses = fixedExpenses.totalExpenses || 0;
  const totalVariableExpenses: any = Object.values(variableExpenses).reduce(
    (sum, exp: any) => sum + exp.amount,
    0
  );
  let arturoMessage: React.ReactNode = `¡Muy bien, ${name}! Ya tenemos toda tu distribución de gastos.`;

  if (showAdvice) {
    arturoMessage = (
      <Container sx={{ fontSize: "15px", margin: 0, padding: 0 }}>
        ✅ <strong>Gastos fijos:</strong> No deberían superar el{" "}
        <strong>50%</strong> de tus ingresos. <br />
        💰 <strong>Ahorro:</strong> Destina al menos un <strong>20%</strong>{" "}
        para futuros objetivos. <br />
        🔍 <strong>Fondo de emergencia:</strong> Siempre útil. <br />
        📊 <strong>Gastos variables:</strong> Evita compras innecesarias. <br />
        🎯 <strong>Planificación:</strong> No te endeudes demasiado.
      </Container>
    );
  }
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

      <ChatBubble
        text={arturoMessage}
        buttonText={!showAdvice ? "¿Quieres un consejo?" : "Cerrar consejo"}
        onButtonClick={() => {
          if (showAdvice) setAdviceClosed(true);
          setShowAdvice(!showAdvice);
        }}
      />

      {adviceClosed && (
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
