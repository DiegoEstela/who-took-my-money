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
    Record<string, { amount: number; order: number }>
  >({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const currency: string = watch("currency") ?? "";
  const [showBubble, setShowBubble] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const existingExpenses = getValues().fixedExpenses || {};
    delete existingExpenses.totalExpenses;

    // 🔹 Garantizamos que cada valor es un objeto con `amount` y `order`
    const updatedExpenses = Object.fromEntries(
      Object.entries(existingExpenses).map(([key, value], index) => {
        const expense =
          typeof value === "object" && value !== null
            ? (value as { amount?: number; order?: number })
            : { amount: 0, order: index + 1 }; // 🔥 Evita que un valor no sea un objeto válido

        return [
          key,
          { amount: expense.amount ?? 0, order: expense.order ?? index + 1 },
        ];
      })
    );

    setFixedExpenses(updatedExpenses);

    const timer = setTimeout(() => setShowBubble(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const totalExpenses = Object.values(fixedExpenses)
    .map((exp) => exp.amount || 0)
    .reduce((sum, amount) => sum + amount, 0);

  const isFormValid = Object.entries(fixedExpenses).every(
    ([name, data]) => name.trim() !== "" && data.amount > 0
  );

  const EVA_TEXT = getEvaTexts(
    "",
    totalExpenses,
    fixedExpenses.amount,
    currency
  );

  const addExpense = () => {
    const newOrder =
      Object.keys(fixedExpenses).length > 0
        ? Math.max(...Object.values(fixedExpenses).map((exp) => exp.order)) + 1
        : 1;

    setFixedExpenses((prev) => ({
      ...prev,
      [""]: { amount: 0, order: newOrder }, // 🔹 Se asigna el orden automáticamente
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
        const newAmount = value.replace(/[^0-9.]/g, ""); // Solo números y puntos decimales
        updatedExpenses[key] = {
          ...prev[key],
          amount: newAmount === "" ? 0 : parseFloat(newAmount),
        };
      } else {
        const newKey = value.trim(); // Evitar claves vacías

        if (newKey !== key && newKey !== "") {
          updatedExpenses[newKey] = {
            ...prev[key],
            amount: prev[key]?.amount || 0,
            order: prev[key]?.order ?? Object.keys(prev).length + 1, // Mantiene el orden
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
        updatedErrors[name] = name.trim() === "" || data.amount <= 0;
      });
      setErrors(updatedErrors);
      return;
    }

    setValue("fixedExpenses", { ...fixedExpenses, totalExpenses });
    onNext();
  };
  console.log(fixedExpenses);
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
                  errors[key] && hasInteracted ? "Campo obligatorio" : ""
                }
              />
              <TextField
                label="Monto"
                variant="outlined"
                type="text"
                value={fixedExpenses[key]?.amount?.toString() || ""} // ✅ Muestra solo números
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
