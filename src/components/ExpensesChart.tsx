import { Box, Typography, LinearProgress } from "@mui/material";

interface ExpensesChartProps {
  variableExpenses: Record<string, { percentage: number; amount: number }>;
  realExpenses: Record<string, number>;
}

const ExpensesChart = ({
  variableExpenses,
  realExpenses,
}: ExpensesChartProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      {Object.entries(variableExpenses).map(([category, data]) => {
        const estimatedAmount = data.amount; // 💰 Lo que el usuario planificó gastar
        const spentAmount = realExpenses[category] || 0; // 🔍 Lo que realmente gastó

        return (
          <Box key={category} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{category}</Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min((spentAmount / estimatedAmount) * 100, 100)} // No sobrepasa 100%
              sx={{
                height: 10,
                borderRadius: 5,
                background:
                  "linear-gradient(135deg, #FFD700,rgba(255, 168, 5, 0.88))",
              }}
            />
            <Typography variant="caption">
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
