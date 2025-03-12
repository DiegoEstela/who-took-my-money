import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import StepNavigationBtn from "../../components/StepNavigationBtn";
import ChatBubble from "../../components/ChatBubble"; // Nueva burbuja temporal

import { StepOnBoarding } from "../../types/userProfile";
import { getEvaTexts } from "../../utils/getEvaTexts";

const StepCompletion = ({
  onNext,
  onBack,
  setValue,
  getValues,
  watch,
}: StepOnBoarding) => {
  const salary = getValues().salary || 0;
  const currency = watch("currency") || "USD"; // Moneda seleccionada
  const totalExpenses = getValues().fixedExpenses?.totalExpenses || 0;
  const savings = getValues().savings || 0; // Asegurar que los ahorros están excluidos
  const availableAmount = salary - totalExpenses - savings; // Dinero disponible después de ahorros

  // Estado para mostrar la burbuja inicial de Arturo
  const [showBubble, setShowBubble] = useState(true);

  const [variableExpenses, setVariableExpenses] = useState<
    Record<string, { percentage: string; amount: number }>
  >({
    Transporte: { percentage: "", amount: 0 },
    Comida: { percentage: "", amount: 0 },
    Ocio: { percentage: "", amount: 0 },
    Compras: { percentage: "", amount: 0 },
    Viajes: { percentage: "", amount: 0 },
    Otros: { percentage: "", amount: 0 },
  });

  // Calcular el total de los porcentajes asignados
  const totalPercentage = Object.values(variableExpenses).reduce(
    (sum, exp) => sum + (parseFloat(exp.percentage) || 0),
    0
  );

  // Calcular el porcentaje restante y el dinero restante a repartir
  const remainingPercentage = 100 - totalPercentage;
  const remainingAmount = (remainingPercentage * availableAmount) / 100;
  const EVA_TEXT = getEvaTexts(
    "",
    0,
    {},
    currency,
    remainingAmount,
    remainingPercentage,
    totalPercentage,
    availableAmount
  );

  // Manejar cambios en los inputs
  const handleInputChange = (category: string, value: string) => {
    let newPercentage = value.replace(/\D/g, ""); // Solo números

    if (newPercentage !== "" && parseFloat(newPercentage) > 99)
      newPercentage = "99"; // Evitar más del 99% en una sola categoría

    const newAmount =
      newPercentage !== ""
        ? Number(
            ((parseFloat(newPercentage) * availableAmount) / 100).toFixed(2)
          )
        : 0; // 🔹 Mantiene solo dos decimales, pero deja vacío si el input está vacío

    setVariableExpenses((prev) => ({
      ...prev,
      [category]: { percentage: newPercentage, amount: newAmount },
    }));
  };

  // Guardar los datos antes de avanzar
  const handleNext = () => {
    setValue(
      "variableExpenses",
      Object.fromEntries(
        Object.entries(variableExpenses).map(([category, data]) => [
          category,
          { percentage: parseFloat(data.percentage) || 0, amount: data.amount },
        ])
      )
    ); // Guardar en React Hook Form sin strings vacíos
    onNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        position: "relative",
        top: -30,
      }}
    >
      {/* Mostrar Burbuja Temporal Solo los Primeros 4 Segundos */}
      {showBubble && (
        <ChatBubble
          text={EVA_TEXT.ONBOARDING.STEP4}
          isVisible={showBubble}
          buttonText="Gracias"
          onButtonClick={() => setShowBubble(false)}
        />
      )}

      <Typography
        variant="body1"
        color="primary"
        fontWeight="bold"
        gutterBottom
        marginBottom={1}
      >
        {EVA_TEXT.ONBOARDING.STEP5}
      </Typography>

      {/* Contenedor de los gastos variables */}
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
              label="%"
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
    </Box>
  );
};

export default StepCompletion;
