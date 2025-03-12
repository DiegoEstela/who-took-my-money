import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import useUserProfile from "../../hooks/useUserProfile";
import { CURRENCY_SYMBOLS } from "../../utils/const";

const Profile = () => {
  const { userData, isLoading, error, isSuccess } = useUserProfile();

  if (isLoading || !userData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !userData) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          No se pudieron cargar los datos del usuario.
        </Typography>
      </Box>
    );
  }
  if (isSuccess) {
  }
  return (
    <Box p={3} maxWidth="80vw" minWidth="70vw" margin="auto">
      {/* 🔹 Contenedor Principal */}
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        {/* 🔹 Ingresos */}
        <Typography variant="h6" gutterBottom>
          💰 <strong>Ingresos:</strong> {CURRENCY_SYMBOLS[userData.currency]}
          {userData.salary.toLocaleString("es-ES")}
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        {/* 🔹 Gastos Fijos Mapeados */}
        <Typography variant="h6" gutterBottom>
          📌 <strong>Gastos Fijos</strong>
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyle: "none", // 🔹 Quita los puntos de la lista
            paddingLeft: 0, // 🔹 Elimina el padding izquierdo
            marginBottom: 2,
          }}
        >
          {Object.entries(userData.fixedExpenses)
            .filter(([key]) => key !== "totalExpenses")
            .map(([key, value]: [string, any]) => (
              <Typography
                key={key}
                component="li"
                variant="body1"
                sx={{
                  textAlign: "left", // 🔹 Alinea el texto a la izquierda
                  paddingLeft: "10px", // 🔹 Pequeño margen para separar
                }}
              >
                <strong>{key}:</strong> {CURRENCY_SYMBOLS[userData.currency]}
                {parseFloat(value).toLocaleString("es-ES")}
              </Typography>
            ))}
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* 🔹 Gastos Variables Mapeados */}
        <Typography variant="h6" gutterBottom>
          🎯 <strong>Gastos Variables</strong>
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyle: "none", // 🔹 Quita los puntos de la lista
            paddingLeft: 0, // 🔹 Elimina el padding izquierdo
            marginBottom: 2,
          }}
        >
          {Object.entries(userData.variableExpenses).map(
            ([key, data]: [string, any]) => (
              <Typography
                key={key}
                component="li"
                variant="body1"
                sx={{
                  textAlign: "left", // 🔹 Alinea el texto a la izquierda
                  paddingLeft: "10px", // 🔹 Pequeño margen para separar
                }}
              >
                <strong>{key}:</strong> {data.percentage}% →
                {CURRENCY_SYMBOLS[userData.currency]}
                {data.amount.toLocaleString("es-ES")}
              </Typography>
            )
          )}
        </Box>

        <Divider sx={{ marginY: 2 }} />

        <Typography variant="h6">
          📊 <strong>Ahorro:</strong> {CURRENCY_SYMBOLS[userData.currency]}
          {userData.ahorro.toLocaleString("es-ES")}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
