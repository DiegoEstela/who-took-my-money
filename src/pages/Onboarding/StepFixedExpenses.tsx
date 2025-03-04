import { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import ChatBubble from "../../components/ChatBubble";
import StepNavigationBtn from "../../components/StepNavigationBtn";

interface StepFixedExpensesProps {
  onNext: () => void;
  onBack: () => void;
  setValue: (name: string, value: any) => void;
  getValues: () => any;
}

const StepFixedExpenses = ({
  onNext,
  onBack,
  setValue,
}: StepFixedExpensesProps) => {
  const [expenses, setExpenses] = useState<{ name: string; amount: number }[]>(
    []
  );

  // Calcular la suma total de gastos fijos
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Definir el mensaje dinámico de Arturo
  let arturoMessage =
    "¡Dime cuáles son tus gastos fijos! No te preocupes, no le diré a nadie.";
  if (totalExpenses > 0) {
    arturoMessage = `Tus gastos fijos son: $${totalExpenses.toLocaleString(
      "es-ES"
    )}. Bueno, con esto ya tenemos una idea de cómo está la cosa 💰.`;
  }
  if (expenses.length > 3) {
    arturoMessage = `¡Guau, cuántos gastos! Vamos a tener que trabajar duro para cubrir todo esto 💼🔥.`;
  }

  // Agregar un nuevo gasto vacío
  const addExpense = () => {
    setExpenses([...expenses, { name: "", amount: 0 }]);
  };

  // Eliminar un gasto
  const removeExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    const newExpenses = [...expenses];
    if (field === "amount") {
      newExpenses[index].amount = Number(value.replace(/\D/g, "")) || 0; // Solo permite números
    } else {
      newExpenses[index].name = value;
    }
    setExpenses(newExpenses);
  };

  // Guardar los datos antes de avanzar
  const handleNext = () => {
    setValue("fixedExpenses", totalExpenses);
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
      <Typography variant="h5" fontWeight="bold">
        Gastos Fijos 💸
      </Typography>

      <Box
        sx={{
          maxHeight: "35vh", // Altura máxima antes de activar el scroll
          overflowY: "auto", // Scroll vertical activado
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ddd", // Opcional: mejora la estructura visual
          "&::-webkit-scrollbar": {
            width: "6px", // Hace la barra de desplazamiento fina
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4CAF50", // Color verde de la barra
            borderRadius: "4px", // Bordes redondeados para que se vea más elegante
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Color del fondo del scroll
            borderRadius: "4px",
          },
        }}
      >
        {expenses.map((expense, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 1,
              marginBottom: "2px",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              label="Gasto"
              variant="outlined"
              value={expense.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              size="small"
            />
            <TextField
              label="Monto"
              variant="outlined"
              type="text"
              value={
                expense.amount ? expense.amount.toLocaleString("es-ES") : ""
              }
              onChange={(e) =>
                handleInputChange(index, "amount", e.target.value)
              }
              size="small"
            />
            <IconButton onClick={() => removeExpense(index)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Botón para agregar más gastos */}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addExpense}
        size="small"
      >
        Agregar Gasto
      </Button>

      <StepNavigationBtn
        onBack={onBack}
        onNext={handleNext}
        disabled={expenses.length === 0}
      />

      {/* Chat de Arturo con el mensaje dinámico */}
      <ChatBubble text={arturoMessage} />
    </Box>
  );
};

export default StepFixedExpenses;
