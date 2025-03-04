import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../../db/firebase";
import { Box, Typography } from "@mui/material";
import { fetchUserData } from "../../services/fetchUserData";
import ExpensesChart from "../../components/ExpensesChart";
import ChatBubble from "../../components/ChatBubble";
import Loading from "../../components/Loading";

const Home = () => {
  const userId = auth.currentUser?.uid;

  // 🔹 Obtener datos del usuario
  const { data, isLoading, error } = useQuery({
    queryKey: ["userData", userId],
    queryFn: () => fetchUserData(userId!),
    enabled: !!userId,
  });

  // 🔹 Obtener la fecha actual
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 🔹 Mensajes de Arturo según el día del mes
  const dayOfMonth = today.getDate();
  let arturoMessage = "";
  if (dayOfMonth <= 10) {
    arturoMessage =
      "🤑 ¡Nuevo mes, nueva oportunidad para no gastarlo todo en el primer finde! Sé fuerte. 💪💸";
  } else if (dayOfMonth <= 20) {
    arturoMessage =
      "🤔 Mitad de mes... ¿Tu presupuesto sigue en forma o ya necesita un rescate? 🚑💸";
  } else {
    arturoMessage =
      "😨 Últimos días del mes... Si el dinero hablara, ¿te reclamaría manutención? 🫣📉";
  }

  // 🔹 Estado para mostrar la burbuja de Arturo y ocultarla después de 2 segundos
  const [showChatBubble, setShowChatBubble] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatBubble(false);
    }, 4000);

    return () => clearTimeout(timer); // Limpiar timeout si el componente se desmonta
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Typography>Error cargando los datos</Typography>;

  // 🔹 Extraer gastos estimados y reales
  const variableExpenses = data?.variableExpenses ?? {};
  const realExpenses = data?.realExpenses ?? {};

  return (
    <Box sx={{ p: 3 }}>
      {/* ✅ Nuevo título dinámico con fecha */}
      <Typography variant="h5" fontWeight="bold">
        📊 Tus gastos
      </Typography>
      <Typography variant="h5"> {formattedDate}</Typography>

      {Object.keys(variableExpenses).length > 0 ? (
        <ExpensesChart
          variableExpenses={variableExpenses}
          realExpenses={realExpenses}
        />
      ) : (
        <Typography variant="body1">No hay gastos registrados aún.</Typography>
      )}

      {/* ✅ Mostrar burbuja de Arturo por 2 segundos */}
      {showChatBubble && <ChatBubble text={arturoMessage} />}
    </Box>
  );
};

export default Home;
