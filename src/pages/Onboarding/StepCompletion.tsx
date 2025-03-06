import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import StepNavigationBtn from "../../components/StepNavigationBtn";
import ChatBubble from "../../components/ChatBubble"; // Nueva burbuja temporal
import ChatBubbleBlock from "../../components/ChatBubbleBlock";
import { getArturoTexts } from "../../utils/arturoTexts";

interface StepCompletionProps {
  onNext: () => void;
  onBack: () => void;
  setValue: (name: string, value: any) => void;
  getValues: () => any;
  watch: (field: string) => any;
}

const StepCompletion = ({
  onNext,
  onBack,
  setValue,
  getValues,
  watch,
}: StepCompletionProps) => {
  const salary = getValues().salary || 0;
  const currency = watch("currency") || "USD"; // Moneda seleccionada
  const totalExpenses = getValues().fixedExpenses?.totalExpenses || 0;
  const availableAmount = salary - totalExpenses; // Dinero disponible

  // Estado para mostrar la burbuja inicial de Arturo
  const [showBubble, setShowBubble] = useState(true);

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
  const ARTURO_TEXT = getArturoTexts(
    "",
    0,
    {},
    currency,
    remainingAmount,
    remainingPercentage,
    totalPercentage,
    availableAmount
  );

  // 📝 **Mensaje Dinámico de Arturo en `ChatBubbleBlock`**

  // Manejar cambios en los inputs
  const handleInputChange = (category: string, value: string) => {
    let newPercentage = Number(value.replace(/\D/g, "")) || 0; // Solo números

    if (newPercentage > 99) newPercentage = 99; // Evitar más del 99% en una sola categoría

    const newAmount = Number(
      ((newPercentage * availableAmount) / 100).toFixed(2)
    ); // 🔹 Mantiene solo dos decimales

    setVariableExpenses((prev) => ({
      ...prev,
      [category]: { percentage: newPercentage, amount: newAmount },
    }));
  };

  // Guardar los datos antes de avanzar
  const handleNext = () => {
    setValue("variableExpenses", variableExpenses); // Guardar en React Hook Form
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
        paddingTop: "50px",
      }}
    >
      {/* Mostrar Burbuja Temporal Solo los Primeros 4 Segundos */}
      {showBubble ? (
        <ChatBubble
          text={ARTURO_TEXT.ONBOARDING.STEP4}
          isVisible={showBubble}
          buttonText="Gracias"
          onButtonClick={() => setShowBubble(false)}
        />
      ) : (
        <ChatBubbleBlock
          text={ARTURO_TEXT.ONBOARDING.STEP5}
          arturoSize={30}
          imagePosition="left"
          fontSize={14}
          sx={{
            position: "absolute",
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "340px",
          }}
        />
      )}

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
    </Box>
  );
};

export default StepCompletion;
