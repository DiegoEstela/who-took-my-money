import { Box, Typography, LinearProgress } from "@mui/material";

interface ExpensesChartProps {
  variableExpenses: Record<string, { percentage: number; amount: number }>;
  realExpenses: Record<string, number>;
}

const getProgressColor = (percentage: number) => {
  if (percentage < 50) return "##1B5E20"; // Verde: Bajo gasto
  if (percentage < 80) return "#FFD700"; // Amarillo: Advertencia
  return "#FF5733"; // Rojo: Cerca del límite
};

const ExpensesChart = ({
  variableExpenses,
  realExpenses,
}: ExpensesChartProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      {Object.entries(variableExpenses).map(([category, data]) => {
        const estimatedAmount = data.amount; // 💰 Lo que el usuario planificó gastar
        const spentAmount = realExpenses[category] || 0; // 🔍 Lo que realmente gastó
        const progress = Math.min((spentAmount / estimatedAmount) * 100, 100);
        const progressColor = getProgressColor(progress);

        return (
          <Box key={category} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{category}</Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "grey",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progressColor,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: "14px", color: "#EAE7DC" }}
            >
              Gastado: ${spentAmount.toLocaleString("es-ES")} / Presupuestado: $
              {estimatedAmount.toLocaleString("es-ES")}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ExpensesChart;
