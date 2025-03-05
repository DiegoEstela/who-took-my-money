import { useState, useEffect } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import StepNavigationBtn from "../../components/StepNavigationBtn";
import ChatBubbleBlock from "../../components/ChatBubbleBlock";
import { handleAmountBlur, handleAmountChange } from "../../utils/formatUtils";

interface StepFixedExpensesProps {
  onNext: () => void;
  onBack: () => void;
  setValue: (name: string, value: any) => void;
  getValues: () => any;
  watch: (field: string) => void;
}

const StepFixedExpenses = ({
  onNext,
  onBack,
  setValue,
  getValues,
  watch,
}: StepFixedExpensesProps) => {
  const [fixedExpenses, setFixedExpenses] = useState<Record<string, number>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const currency = watch("currency");

  useEffect(() => {
    const existingExpenses = { ...getValues().fixedExpenses };
    delete existingExpenses.totalExpenses;
    setFixedExpenses(existingExpenses);
  }, []);

  const totalExpenses = Object.values(fixedExpenses)
    .map((amount) => parseFloat(amount as any) || 0) // 🔹 Asegura que todos los valores sean numéricos
    .reduce((sum, amount) => sum + amount, 0);

  const isFormValid = Object.entries(fixedExpenses).every(
    ([name, amount]) => name.trim() !== "" && amount > 0
  );

  let arturoMessage =
    "¡Dime cuáles son tus gastos fijos! No te preocupes, no le diré a nadie.";
  if (totalExpenses > 0) {
    arturoMessage = `Tus gastos fijos suman: ${currency} ${totalExpenses.toLocaleString(
      "es-ES"
    )}`;
  }
  if (Object.keys(fixedExpenses).length > 3) {
    arturoMessage = `¡Guau, cuántos gastos! Vamos a trabajar duro para cubrir todo esto🔥. Total:  ${currency} ${totalExpenses.toLocaleString(
      "es-ES"
    )}`;
  }

  const addExpense = () => {
    setFixedExpenses({ ...fixedExpenses, "": 0 });
    setErrors({ ...errors, "": true });
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
    setFixedExpenses((prev) => {
      let updatedExpenses = { ...prev };

      if (field === "amount") {
        // Permitir solo números y un solo punto decimal
        const amount = value.replace(/[^0-9.]/g, "");
        const validAmount =
          amount.split(".").length > 2 ? amount.slice(0, -1) : amount;
        updatedExpenses[key] = validAmount ? parseFloat(validAmount) : 0;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: updatedExpenses[key] <= 0,
        }));
      } else {
        // Permitir solo letras y espacios en el concepto
        const newKey = value.replace(/[0-9]/g, "");

        if (newKey !== key) {
          updatedExpenses[newKey] = updatedExpenses[key] || 0;
          delete updatedExpenses[key];
        }

        setErrors((prevErrors) => ({
          ...prevErrors,
          [newKey]: newKey.trim() === "",
        }));
      }

      return updatedExpenses;
    });
  };

  const handleNext = () => {
    if (!isFormValid) {
      const updatedErrors: Record<string, boolean> = {};
      Object.entries(fixedExpenses).forEach(([name, amount]) => {
        updatedErrors[name] = name.trim() === "" || amount <= 0;
      });
      setErrors(updatedErrors);
      return;
    }

    setValue("fixedExpenses", { ...fixedExpenses, totalExpenses });
    console.log("Fixed Expenses guardados:", {
      ...fixedExpenses,
      totalExpenses,
    });
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
        paddingTop: "30px", // 🔹 Agrega espacio para que Arturo no tape otros elementos
      }}
    >
      <ChatBubbleBlock
        text={arturoMessage}
        arturoSize={30}
        imagePosition="left"
        fontSize={14}
        sx={{
          position: "absolute",
          top: "-50px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "340px",
        }}
      />
      {/* Contenedor de los gastos fijos */}
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
        {Object.entries(fixedExpenses).map(([key], index) =>
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
                error={!!errors[key]}
                helperText={errors[key] ? "Campo obligatorio" : ""}
              />
              <TextField
                label="Monto"
                variant="outlined"
                type="text"
                value={fixedExpenses[key]?.toString() || ""}
                onChange={(e) =>
                  handleAmountChange(
                    key,
                    e.target.value,
                    setFixedExpenses,
                    setErrors
                  )
                }
                onBlur={(e) =>
                  handleAmountBlur(key, e.target.value, setFixedExpenses)
                }
                size="small"
                error={!!errors[key]}
                helperText={errors[key] ? "Menor a 0" : ""}
              />
              <IconButton onClick={() => removeExpense(key)} color="error">
                <Delete />
              </IconButton>
            </Box>
          ) : null
        )}
      </Box>

      {/* Botón de agregar gasto centrado */}
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
