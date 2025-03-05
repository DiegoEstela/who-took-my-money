import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import StepNavigationBtn from "../../components/StepNavigationBtn";
import ChatBubble from "../../components/ChatBubble"; // Nueva burbuja temporal
import ChatBubbleBlock from "../../components/ChatBubbleBlock";

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
  const initialArturoMessage = (
    <Box>
      <Box textAlign="center">
        <Typography variant="h6" fontWeight="bold">
          ¡Último paso! 🎯
        </Typography>
        <Typography variant="body1" sx={{ marginTop: "8px", fontSize: "16px" }}>
          Ahora asignarás porcentajes a tus <strong>gastos variables</strong>.
        </Typography>
        <Typography variant="body1" sx={{ marginTop: "8px", fontSize: "14px" }}>
          Esto te ayudará a <strong>tener un plan claro</strong> sobre cómo usar
          tu dinero. 💡💰
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ marginTop: "3px", fontWeight: "bold" }}>
        Te sugerimos esta distribución:
      </Typography>
      <ul
        style={{
          paddingLeft: "20px",
          textAlign: "left",
          display: "inline-block",
          fontSize: "14px",
        }}
      >
        <li>
          📌 <strong>Ahorro:</strong> 20%
        </li>
        <li>
          📌 <strong>Comida:</strong> 30%
        </li>
        <li>
          📌 <strong>Ocio:</strong> 15%
        </li>
        <li>
          📌 <strong>Compras:</strong> 10%
        </li>
        <li>
          📌 <strong>Viajes:</strong> 15%
        </li>
        <li>
          📌 <strong>Otros:</strong> 10% (Para lo que no encaje en las demás
          categorías)
        </li>
      </ul>

      <Typography variant="body1" textAlign="center" fontSize="14px">
        Recuerda que <strong>‘Otros’</strong> te permite personalizar aún más tu
        presupuesto. ¡Vamos a organizarnos mejor! 🚀
      </Typography>
    </Box>
  );

  // 📝 **Mensaje Dinámico de Arturo en `ChatBubbleBlock`**
  let arturoMessage = `Después de pagar tus gastos fijos de ${currency} ${totalExpenses.toLocaleString(
    "es-ES"
  )}, tienes ${currency} ${availableAmount.toLocaleString(
    "es-ES"
  )} para repartir en gastos variables.`;

  if (totalPercentage > 100) {
    arturoMessage = `¡Cuidado! Estás asignando más del 100% de tu dinero disponible! 🫣`;
  } else if (totalPercentage < 100) {
    arturoMessage = `Te falta asignar ${remainingPercentage}% de ${currency} ${remainingAmount.toLocaleString(
      "es-ES"
    )}📊 ¡Sigue ajustando!`;
  } else {
    arturoMessage = `¡Perfecto! Has asignado el 100% de tu dinero disponible.`;
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
        alignItems: "center",
        width: "100%",
        position: "relative",
        paddingTop: "50px",
      }}
    >
      {/* Mostrar Burbuja Temporal Solo los Primeros 4 Segundos */}
      {showBubble ? (
        <ChatBubble
          text={initialArturoMessage}
          isVisible={showBubble}
          buttonText="Gracias"
          onButtonClick={() => setShowBubble(false)}
        />
      ) : (
        <ChatBubbleBlock
          text={arturoMessage}
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
