import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
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
  getValues,
}: StepFixedExpensesProps) => {
  const theme = useTheme();
  const [fixedExpenses, setFixedExpenses] = useState<Record<string, number>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({}); // 🔹 Errores de validación

  useEffect(() => {
    // Obtener los gastos guardados en React Hook Form al montar el componente
    const existingExpenses = { ...getValues().fixedExpenses };
    delete existingExpenses.totalExpenses; // 🔹 Evita que `totalExpenses` se multiplique

    setFixedExpenses(existingExpenses);
  }, []); // 🔹 Se ejecuta solo al montar el componente

  // Calcular la suma total de gastos fijos
  const totalExpenses = Object.values(fixedExpenses).reduce(
    (sum, amount) => sum + amount,
    0
  );

  // Validar si todos los campos están completos
  const isFormValid = Object.entries(fixedExpenses).every(
    ([name, amount]) => name.trim() !== "" && amount > 0
  );

  // Mensaje dinámico de Arturo
  let arturoMessage =
    "¡Dime cuáles son tus gastos fijos! No te preocupes, no le diré a nadie.";
  if (totalExpenses > 0) {
    arturoMessage = `Tus gastos fijos son: $${totalExpenses.toLocaleString(
      "es-ES"
    )}. Bueno, con esto ya tenemos una idea de cómo está la cosa 💰.`;
  }
  if (Object.keys(fixedExpenses).length > 3) {
    arturoMessage = `¡Guau, cuántos gastos! Vamos a tener que trabajar duro para cubrir todo esto🔥. Gastos: $${totalExpenses.toLocaleString(
      "es-ES"
    )}`;
  }

  // Agregar un nuevo gasto vacío con validación
  const addExpense = () => {
    if (fixedExpenses["Nuevo Gasto"] !== undefined) return; // Evitar agregar duplicados
    setFixedExpenses({ ...fixedExpenses, "": 0 });
    setErrors({ ...errors, "Nuevo Gasto": true }); // 🔹 Marcar error en el nuevo campo
  };

  // Eliminar un gasto
  const removeExpense = (key: string) => {
    const updatedExpenses = { ...fixedExpenses };
    delete updatedExpenses[key];
    setFixedExpenses(updatedExpenses);

    const updatedErrors = { ...errors };
    delete updatedErrors[key];
    setErrors(updatedErrors); // 🔹 Eliminar errores asociados
  };

  // Manejar cambios en los inputs
  const handleInputChange = (
    key: string,
    field: "name" | "amount",
    value: string
  ) => {
    setFixedExpenses((prev) => {
      let updatedExpenses = { ...prev };

      if (field === "amount") {
        const amount = Number(value.replace(/\D/g, "")) || 0;
        updatedExpenses[key] = amount;
        setErrors((prevErrors) => ({ ...prevErrors, [key]: amount <= 0 }));
      } else {
        const newKey = value.trim();
        if (newKey && newKey !== key) {
          updatedExpenses[newKey] = updatedExpenses[key]; // Copiar el monto al nuevo nombre
          delete updatedExpenses[key]; // Eliminar la clave antigua

          setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[key]; // Quitar el error de la clave antigua
            updatedErrors[newKey] = newKey === ""; // Marcar error si está vacío
            return updatedErrors;
          });
        }
      }

      return updatedExpenses;
    });
  };

  // Guardar los datos antes de avanzar
  const handleNext = () => {
    if (!isFormValid) {
      // 🔹 Marcar errores si hay campos vacíos
      const updatedErrors: Record<string, boolean> = {};
      Object.entries(fixedExpenses).forEach(([name, amount]) => {
        updatedErrors[name] = name.trim() === "" || amount <= 0;
      });
      setErrors(updatedErrors);
      return;
    }

    // Guardar el total correctamente evitando acumulaciones previas
    const updatedExpenses = { ...fixedExpenses, totalExpenses };
    setValue("fixedExpenses", updatedExpenses); // Guardamos en React Hook Form
    console.log("Fixed Expenses guardados:", updatedExpenses);
    onNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color={theme.palette.customColors.black}
      >
        Gastos Fijos 💸
      </Typography>

      <Box
        sx={{
          maxHeight: "35vh",
          overflowY: "auto",
          width: "100%",
          padding: "8px",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4CAF50",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "4px",
          },
        }}
      >
        {Object.entries(fixedExpenses).map(([key, amount], index) =>
          key !== "totalExpenses" ? ( // No mostrar totalExpenses en los inputs
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                marginBottom: "6px",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TextField
                label="Concepto"
                variant="outlined"
                value={key}
                onChange={(e) => handleInputChange(key, "name", e.target.value)}
                size="small"
                error={!!errors[key]}
                helperText={errors[key] ? "Este campo es obligatorio" : ""}
              />
              <TextField
                label="Monto"
                variant="outlined"
                type="text"
                value={amount ? amount.toLocaleString("es-ES") : ""}
                onChange={(e) =>
                  handleInputChange(key, "amount", e.target.value)
                }
                size="small"
                error={!!errors[key]}
                helperText={errors[key] ? "Debe ser mayor a 0" : ""}
              />
              <IconButton onClick={() => removeExpense(key)} color="error">
                <Delete />
              </IconButton>
            </Box>
          ) : null
        )}
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
        disabled={!isFormValid}
      />

      {/* Chat de Arturo con el mensaje dinámico */}
      <ChatBubble text={arturoMessage} />
    </Box>
  );
};

export default StepFixedExpenses;
