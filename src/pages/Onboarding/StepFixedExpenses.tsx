import { useState, useEffect } from "react";
import { Box, TextField, Button, IconButton, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import StepNavigationBtn from "../../components/StepNavigationBtn";
import { getEvaTexts } from "../../utils/getEvaTexts";
import { StepOnBoarding } from "../../types/userProfile";
import ChatBubble from "../../components/ChatBubble";

const StepFixedExpenses = ({
  onNext,
  onBack,
  setValue,
  getValues,
  watch,
}: StepOnBoarding) => {
  const [fixedExpenses, setFixedExpenses] = useState<
    Record<string, { amount: string; order: number }>
  >({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const currency: string = watch("currency") ?? "";
  const [showBubble, setShowBubble] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const existingExpenses = getValues().fixedExpenses || {};
    delete existingExpenses.totalExpenses;

    // ✅ Se asegura de que cada `value` tenga `amount` y `order`
    const updatedExpenses = Object.fromEntries(
      Object.entries(existingExpenses).map(([key, value], index) => {
        const expense = (value as { amount?: number; order?: number }) || {}; // 🔹 Se fuerza el tipo

        return [
          key,
          {
            amount:
              expense.amount !== undefined ? expense.amount.toString() : "", // 🔹 Convierte a string o deja vacío
            order: expense.order !== undefined ? expense.order : index + 1, // 🔹 Asegura un número de orden válido
          },
        ];
      })
    );

    setFixedExpenses(updatedExpenses);

    const timer = setTimeout(() => setShowBubble(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const totalExpenses = Object.values(fixedExpenses)
    .map((exp) => parseFloat(exp.amount) || 0)
    .reduce((sum, amount) => sum + amount, 0);

  const isFormValid = Object.entries(fixedExpenses).every(
    ([name, data]) => name.trim() !== "" && parseFloat(data.amount) > 0
  );

  const expensesAsNumbers = Object.fromEntries(
    Object.entries(fixedExpenses).map(([key, value]) => [
      key,
      parseFloat(value.amount) || 0,
    ])
  );

  const EVA_TEXT = getEvaTexts("", totalExpenses, expensesAsNumbers, currency);

  const addExpense = () => {
    const newOrder =
      Object.keys(fixedExpenses).length > 0
        ? Math.max(...Object.values(fixedExpenses).map((exp) => exp.order)) + 1
        : 1;

    setFixedExpenses((prev) => ({
      ...prev,
      [""]: { amount: "", order: newOrder }, // 🔹 Empieza vacío en lugar de 0
    }));

    setErrors((prev) => ({ ...prev, [""]: false }));
  };

  const removeExpense = (key: string) => {
    const updatedExpenses = { ...fixedExpenses };
    delete updatedExpenses[key];
    setFixedExpenses(updatedExpenses);

    const updatedErrors = { ...errors };
    delete updatedErrors[key];
    setErrors(updatedErrors);
  };

  const handleInputChange = (
    key: string,
    field: "name" | "amount",
    value: string
  ) => {
    setHasInteracted(true);
    setFixedExpenses((prev) => {
      let updatedExpenses = { ...prev };

      if (field === "amount") {
        // ✅ Solo permite números y un solo punto decimal
        let newAmount = value.replace(/[^0-9.]/g, "");

        // ✅ Evita más de un punto decimal
        const dotCount = (newAmount.match(/\./g) || []).length;
        if (dotCount > 1) {
          newAmount = newAmount.slice(0, -1); // Elimina el último punto ingresado
        }

        // ✅ Limitar a solo 2 decimales
        if (newAmount.includes(".")) {
          const [integerPart, decimalPart] = newAmount.split(".");
          newAmount =
            decimalPart.length > 2
              ? `${integerPart}.${decimalPart.slice(0, 2)}`
              : newAmount;
        }

        updatedExpenses[key] = {
          ...prev[key],
          amount: newAmount, // 🔹 Permite string vacío, no pone 0 automáticamente
        };
      } else {
        // ✅ Evita que el concepto contenga números
        const newKey = value.replace(/[0-9]/g, "");

        if (newKey !== key) {
          updatedExpenses[newKey] = {
            ...prev[key],
            amount: prev[key]?.amount || "", // 🔹 Mantiene el monto asignado
            order: prev[key]?.order ?? Object.keys(prev).length + 1, // 🔹 Mantiene el orden
          };
          delete updatedExpenses[key];
        }
      }

      return updatedExpenses;
    });
  };

  const handleNext = () => {
    if (!isFormValid) {
      setHasInteracted(true);
      const updatedErrors: Record<string, boolean> = {};
      Object.entries(fixedExpenses).forEach(([name, data]) => {
        updatedErrors[name] =
          name.trim() === "" || parseFloat(data.amount) <= 0;
      });
      setErrors(updatedErrors);
      return;
    }

    setValue("fixedExpenses", { ...fixedExpenses, totalExpenses });
    onNext();
  };

  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        top: -40,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
      }}
    >
      <Typography
        variant="body1"
        color="primary"
        fontWeight="bold"
        gutterBottom
      >
        {EVA_TEXT.ONBOARDING.STEP3}
      </Typography>

      <ChatBubble text={EVA_TEXT.ONBOARDING.STEP3} isVisible={showBubble} />

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
        {Object.entries(fixedExpenses).map(([key, _data], index) =>
          key !== "totalExpenses" ? (
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
                error={errors[key] && hasInteracted}
                helperText={
                  errors[key] && hasInteracted
                    ? "No puede ser solo números"
                    : ""
                }
              />
              <TextField
                label="Monto"
                variant="outlined"
                type="text"
                value={fixedExpenses[key]?.amount || ""} // ✅ Ahora el monto empieza vacío
                onChange={(e) =>
                  handleInputChange(key, "amount", e.target.value)
                }
                size="small"
                error={errors[key] && hasInteracted}
                helperText={
                  errors[key] && hasInteracted ? "Debe ser mayor a 0" : ""
                }
              />

              <IconButton onClick={() => removeExpense(key)} color="error">
                <Delete />
              </IconButton>
            </Box>
          ) : null
        )}
      </Box>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addExpense}
          size="small"
        >
          Agregar Gasto
        </Button>
      </Box>

      <StepNavigationBtn
        onBack={onBack}
        onNext={handleNext}
        disabled={!isFormValid}
      />
    </Box>
  );
};

export default StepFixedExpenses;
