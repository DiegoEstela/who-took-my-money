import { useState, useEffect } from "react";
import { Box, TextField, Button, IconButton, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import StepNavigationBtn from "../../components/StepNavigationBtn";
import { handleAmountBlur, handleAmountChange } from "../../utils/formatUtils";
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
  const [fixedExpenses, setFixedExpenses] = useState<Record<string, number>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const currency: string = watch("currency") ?? "";
  const [showBubble, setShowBubble] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const existingExpenses = { ...getValues().fixedExpenses };
    delete existingExpenses.totalExpenses;
    setFixedExpenses(existingExpenses);
    const timer = setTimeout(() => setShowBubble(false), 3000); // Desaparece en 3 segundos
    return () => clearTimeout(timer);
  }, []);

  const totalExpenses = Object.values(fixedExpenses)
    .map((amount) => parseFloat(amount as any) || 0)
    .reduce((sum, amount) => sum + amount, 0);

  const isFormValid = Object.entries(fixedExpenses).every(
    ([name, amount]) => name.trim() !== "" && amount > 0
  );
  const EVA_TEXT = getEvaTexts("", totalExpenses, fixedExpenses, currency);

  const addExpense = () => {
    setFixedExpenses((prev) => ({ ...prev, "": 0 }));
    setErrors((prev) => ({ ...prev, "": false }));
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
        const amount = value.replace(/[^0-9.]/g, "");
        const validAmount =
          amount.split(".").length > 2 ? amount.slice(0, -1) : amount;

        updatedExpenses[key] = validAmount === "" ? 0 : parseFloat(validAmount);

        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: hasInteracted && updatedExpenses[key] <= 0,
        }));
      } else {
        const newKey = value.replace(/[0-9]/g, "");

        if (newKey !== key) {
          updatedExpenses[newKey] = updatedExpenses[key] || 0;
          delete updatedExpenses[key];
        }

        setErrors((prevErrors) => ({
          ...prevErrors,
          [newKey]: hasInteracted && newKey.trim() === "",
        }));
      }

      return updatedExpenses;
    });
  };

  const handleNext = () => {
    if (!isFormValid) {
      setHasInteracted(true);
      const updatedErrors: Record<string, boolean> = {};
      Object.entries(fixedExpenses).forEach(([name, amount]) => {
        updatedErrors[name] = name.trim() === "" || amount <= 0;
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
                error={errors[key] && hasInteracted}
                helperText={
                  errors[key] && hasInteracted ? "Campo obligatorio" : ""
                }
              />
              <TextField
                label="Monto"
                variant="outlined"
                type="text"
                value={
                  fixedExpenses[key] === 0 ? "" : fixedExpenses[key].toString()
                }
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
                error={errors[key] && hasInteracted}
                helperText={errors[key] && hasInteracted ? "Menor a 0" : ""}
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
