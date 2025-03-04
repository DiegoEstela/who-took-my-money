import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import ChatBubble from "../../components/ChatBubble";
import StepNavigationBtn from "../../components/StepNavigationBtn";

interface StepCompletionProps {
  onNext: () => void;
  onBack: () => void;
  setValue: (name: string, value: any) => void;
  getValues: () => any;
}

const StepCompletion = ({
  onNext,
  onBack,
  setValue,
  getValues,
}: StepCompletionProps) => {
  const salary = getValues().salary || 0;
  const totalExpenses = getValues().fixedExpenses?.totalExpenses || 0;
  const availableAmount = salary - totalExpenses; // Dinero disponible

  const [variableExpenses, setVariableExpenses] = useState<
    Record<string, { percentage: number; amount: number }>
  >({
    Ahorro: { percentage: 0, amount: 0 },
    Comida: { percentage: 0, amount: 0 },
    Ocio: { percentage: 0, amount: 0 },
    Compras: { percentage: 0, amount: 0 },
    Viajes: { percentage: 0, amount: 0 },
    Otros: { percentage: 0, amount: 0 },
  });

  // Calcular el total de los porcentajes asignados
  const totalPercentage = Object.values(variableExpenses).reduce(
    (sum, exp) => sum + exp.percentage,
    0
  );

  // Calcular el porcentaje restante y el dinero restante a repartir
  const remainingPercentage = 100 - totalPercentage;
  const remainingAmount = (remainingPercentage * availableAmount) / 100;

  // Mensaje de Arturo dinámico
  let arturoMessage = `Después de pagar tus gastos fijos de $${totalExpenses.toLocaleString(
    "es-ES"
  )}, tienes $${availableAmount.toLocaleString(
    "es-ES"
  )} para repartir en gastos variables.`;

  if (totalPercentage > 100) {
    arturoMessage = `¡Cuidado! Estás asignando más del 100% de tu dinero disponible! 🫣`;
  } else if (totalPercentage < 100) {
    arturoMessage = `Aún te falta asignar ${remainingPercentage}% $${remainingAmount.toLocaleString(
      "es-ES"
    )} de tu dinero disponible. 📊 ¡Sigue ajustando!`;
  } else {
    arturoMessage = `¡Perfecto! Has asignado el 100% de tu dinero disponible de manera equilibrada.`;
  }

  // Manejar cambios en los inputs
  const handleInputChange = (category: string, value: string) => {
    let newPercentage = Number(value.replace(/\D/g, "")) || 0; // Solo números

    if (newPercentage > 99) newPercentage = 99; // Evitar más del 99% en una sola categoría

    const newAmount = (newPercentage * availableAmount) / 100;

    setVariableExpenses((prev) => ({
      ...prev,
      [category]: { percentage: newPercentage, amount: newAmount },
    }));
  };

  // Guardar los datos antes de avanzar
  const handleNext = () => {
    setValue("variableExpenses", variableExpenses); // Guardar en React Hook Form
    console.log("Gastos variables guardados:", getValues().variableExpenses);
    onNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "center",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Gastos Variables 🏦
      </Typography>

      <Box sx={{ width: "100%" }}>
        {Object.entries(variableExpenses).map(([category, data]) => (
          <Box
            key={category}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              width: "100%",
              marginBottom: "8px",
            }}
          >
            <TextField
              label="Concepto"
              variant="outlined"
              value={category}
              disabled
              size="small"
            />
            <TextField
              label="% Asignado"
              variant="outlined"
              type="text"
              value={data.percentage}
              onChange={(e) => handleInputChange(category, e.target.value)}
              size="small"
              sx={{ maxWidth: "80px" }}
            />
            <TextField
              label="Monto"
              variant="outlined"
              type="text"
              value={data.amount.toLocaleString("es-ES")}
              disabled
              size="small"
            />
          </Box>
        ))}
      </Box>

      {/* Botón de navegación deshabilitado si no se asigna exactamente el 100% */}
      <StepNavigationBtn
        onBack={onBack}
        onNext={handleNext}
        disabled={totalPercentage !== 100}
      />

      {/* Chat de Arturo con el mensaje dinámico */}
      <ChatBubble text={arturoMessage} />
    </Box>
  );
};

export default StepCompletion;
