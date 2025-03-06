import { useEffect, useState } from "react";
import { Button, TextField, Grid, Typography, Box } from "@mui/material";
import { Save } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useNotification } from "../../context/useNotification";
import { saveExpenseToDB } from "../../services/saveExpense";
import useCheckUser from "../../hooks/useCheckUser";
import { fetchUserData } from "../../services/fetchUserData";
import useBudgetAnalysis from "../../hooks/useBudgetAnalysis";
import ChatBubble from "./../../components/ChatBubble";

const categories = [
  { id: "Ahorro", label: "Ahorro", icon: "💰" },
  { id: "Comida", label: "Comida", icon: "🍔" },
  { id: "Ocio", label: "Ocio", icon: "🎮" },
  { id: "Compras", label: "Compras", icon: "🛋️" },
  { id: "Viajes", label: "Viajes", icon: "✈️" },
  { id: "Otros", label: "Otros", icon: "🔹" },
];

export default function ExpenseEntry() {
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const { user } = useCheckUser();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { amount: "", description: "" },
  });
  const { showNotification } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Obtener datos del usuario para calcular el saldo restante por categoría
  const { data } = useQuery({
    queryKey: ["userData", user?.uid],
    queryFn: () => fetchUserData(user?.uid!),
    enabled: !!user?.uid,
  });

  const { warning, inputWarning, checkAmountExceeds } = useBudgetAnalysis(
    data?.variableExpenses || {},
    data?.realExpenses || {}
  );

  const remainingBudget = selectedCategory
    ? (data?.variableExpenses[selectedCategory]?.amount || 0) -
      (data?.realExpenses[selectedCategory] || 0)
    : 0;

  const mutation = useMutation({
    mutationFn: (data: {
      category: string;
      amount: number;
      description: string;
    }) => saveExpenseToDB(user?.uid ?? "", data, showNotification),
    onSuccess: () => {
      reset({ amount: "", description: "" }); // Resetea los inputs pero mantiene la categoría seleccionada
    },
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const onSubmit = (data: { amount: string; description: string }) => {
    if (!selectedCategory) return;

    const expenseData = {
      category: selectedCategory,
      amount: parseFloat(data.amount),
      description: data.description,
    };

    mutation.mutate(expenseData);
  };

  const amount = watch("amount");
  const description = watch("description");
  const isFormValid = selectedCategory && amount && description;

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 4000); // Desaparece en 4 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <ChatBubble
        text={warning}
        onButtonClick={() => setShowBubble(false)}
        isVisible={showBubble}
      />

      {selectedCategory && (
        <Typography
          variant="body1"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          {selectedCategory
            ? `Saldo restante en ${selectedCategory}: ${remainingBudget.toFixed(
                2
              )}`
            : ""}
        </Typography>
      )}

      <form
        onSubmit={handleSubmit(onSubmit as any)}
        style={{ width: "100%", maxWidth: 400, textAlign: "center" }}
      >
        <Grid container spacing={2} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={6} key={cat.id}>
              <Button
                variant={selectedCategory === cat.id ? "contained" : "outlined"}
                onClick={() => handleCategorySelect(cat.id)}
                fullWidth
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h6">{cat.icon}</Typography>
                  <Typography variant="caption">{cat.label}</Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>

        <Box mt={2}>
          <Controller
            name="amount"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Monto"
                variant="outlined"
                InputProps={{ startAdornment: "$" }}
                type="number"
                size="small"
                onChange={(e) => {
                  field.onChange(e);
                  if (selectedCategory) {
                    checkAmountExceeds(
                      selectedCategory,
                      parseFloat(e.target.value) || 0
                    );
                  }
                }}
                helperText={inputWarning || ""}
                sx={{
                  "& label": { color: "#1B5E20", fontWeight: "bold" }, // Cambia el color del label
                  "& .MuiFormHelperText-root": {
                    color: "rgba(99, 0, 0, 0.8)",
                    fontWeight: "bold",
                  }, // Cambia el color del helperText
                }}
              />
            )}
          />
        </Box>

        <Box mt={2}>
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Descripción"
                variant="outlined"
                size="small"
                sx={{
                  "& label": { color: "#1B5E20" },
                }}
              />
            )}
          />
        </Box>

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Save />}
            disabled={!isFormValid}
            fullWidth
          >
            Agregar Gasto
          </Button>
        </Box>
      </form>
    </Box>
  );
}
