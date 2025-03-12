import { useState } from "react";
import { Box, Typography, Slider, Button } from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { saveSavingsToDB } from "../../services/saveSavingsToDB";
import useCheckUser from "../../hooks/useCheckUser";
import { useNotification } from "../../context/useNotification";
import { fetchUserProfile } from "../../services/fetchUserProfile";

const Savings = () => {
  const { user } = useCheckUser();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const { data } = useQuery({
    queryKey: ["userData", user?.uid],
    queryFn: () => fetchUserProfile(user?.uid!),
    enabled: !!user?.uid,
  });

  const currency = data?.currency || 0;
  const salary = data?.salary || 0;
  const fixedExpenses = data?.fixedExpenses?.totalExpenses || 0;
  const plannedSavings = data?.ahorro || 0; // Ahorro presupuestado
  const maxSavings = salary - fixedExpenses;

  const [savingsAmount, setSavingsAmount] = useState(plannedSavings);
  const [saving, setSaving] = useState(false);

  // Mutación para guardar los ahorros en Firestore
  const saveSavingsMutation = useMutation({
    mutationFn: (amount: number) =>
      saveSavingsToDB(user?.uid!, amount, showNotification),
    onSuccess: () => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        navigate("/"); // Redirige a Home después de ahorrar
      }, 3000);
    },
  });

  const handleSave = () => {
    saveSavingsMutation.mutate(savingsAmount);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "70vh",
      }}
    >
      {saving && (
        <Confetti numberOfPieces={600} recycle={false} gravity={0.3} />
      )}{" "}
      {/* Confeti más rápido */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📈 ¡Hora de Ahorrar!
      </Typography>
      <Typography variant="body2" gutterBottom>
        Ajusta cuánto dinero quieres ahorrar este mes.
      </Typography>
      <Box width="85%" maxWidth="400px" mt={2}>
        <Slider
          value={savingsAmount}
          onChange={(_, newValue) => setSavingsAmount(newValue as number)}
          step={1}
          min={1}
          max={maxSavings}
          valueLabelDisplay="on"
          sx={{
            marginTop: "20px",
            "& .MuiSlider-thumb": {
              backgroundColor: "#FF9800",
            },
            "& .MuiSlider-track": {
              backgroundColor: "#FFA726",
            },
          }}
        />
      </Box>
      <Typography variant="h6" mt={2}>
        Guardarás{" "}
        <b>
          {`${currency}
          ${savingsAmount.toLocaleString("es-ES")}`}
        </b>{" "}
        este mes.
      </Typography>
      <Typography variant="body2" mt={1}>
        Ahorro presupuestado:{" "}
        <b>
          {`${currency}
          ${plannedSavings.toLocaleString("es-ES")}`}
        </b>{" "}
      </Typography>
      <Button
        variant="contained"
        color="success"
        startIcon={<SavingsIcon />}
        sx={{
          marginTop: "20px",
          fontSize: "18px",
          padding: "12px 24px",
          borderRadius: "50px",
          background: "#2E7D32",
          boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.6)", // Sombra exagerada
          transition: "all 0.2s ease-in-out",
          "&:hover": { background: "#1B5E20" },
          "&:active": {
            boxShadow: "none", // Elimina la sombra al hacer clic
            transform: "translateY(4px)", // Simula botón presionado
          },
        }}
        onClick={handleSave}
      >
        AHORRAR
      </Button>
    </Box>
  );
};

export default Savings;
