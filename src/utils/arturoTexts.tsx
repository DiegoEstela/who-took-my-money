import { Box, Typography } from "@mui/material";

export const getArturoTexts = (
  name?: string,
  totalExpenses: number = 0,
  fixedExpenses: Record<string, number> = {},
  currency: string = "USD",
  remainingAmount: number = 0,
  remainingPercentage: number = 0,
  totalPercentage: number = 0,
  availableAmount: number = 0
) => {
  // mensaje base de Arturo para STEP3
  let step3Message = "¿Me podrias decir cuáles son tus gastos fijos?";

  if (totalExpenses > 0) {
    step3Message = `Tus gastos fijos suman: ${currency} ${totalExpenses.toLocaleString(
      "es-ES"
    )}`;
  }

  if (Object.keys(fixedExpenses).length > 3) {
    step3Message = `Vamos a trabajar duro para cubrir todo esto🔥. Total:  ${currency} ${totalExpenses.toLocaleString(
      "es-ES"
    )}`;
  }

  // mensaje base de Arturo para STEP4

  let step5Message = `Después de pagar tus gastos fijos de ${currency} ${totalExpenses.toLocaleString(
    "es-ES"
  )}, tienes ${currency} ${availableAmount.toLocaleString(
    "es-ES"
  )} para repartir en gastos variables.`;

  if (totalPercentage > 100) {
    step5Message = `¡Cuidado! Estás asignando más del 100% de tu dinero disponible! 🫣`;
  } else if (totalPercentage < 100) {
    step5Message = `Te falta asignar ${remainingPercentage}% de ${currency} ${remainingAmount.toLocaleString(
      "es-ES"
    )}📊 ¡Sigue ajustando!`;
  } else {
    step5Message = `¡Perfecto! Has asignado el 100% de tu dinero disponible.`;
  }
  return {
    ONBOARDING: {
      STEP1:
        "¡Hola! Soy Arturo, tu asistente financiero. Antes de empezar, me gustaría saber cómo te llamas.",
      STEP2: `Eh... ${
        name ?? "usuario"
      }, esto es un poco incómodo, pero... ¿me podrías decir cuál es tu sueldo mensual y en qué moneda lo manejas? Es importante para que puedas aprovechar al máximo la app. ¡Palabra de Arturo! 💰🤫`,
      STEP3: step3Message,
      STEP4: (
        <Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              ¡Último paso! 🎯
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "8px", fontSize: "16px" }}
            >
              Ahora asignarás porcentajes a tus{" "}
              <strong>gastos variables</strong>.
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "8px", fontSize: "14px" }}
            >
              Esto te ayudará a <strong>tener un plan claro</strong> sobre cómo
              usar tu dinero. 💡💰
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ marginTop: "3px", fontWeight: "bold" }}
          >
            Te sugerimos esta distribución:
          </Typography>
          <ul
            style={{
              paddingLeft: "20px",
              textAlign: "left",
              display: "inline-block",
              fontSize: "14px",
            }}
          >
            <li>
              📌 <strong>Ahorro:</strong> 20%
            </li>
            <li>
              📌 <strong>Comida:</strong> 30%
            </li>
            <li>
              📌 <strong>Ocio:</strong> 15%
            </li>
            <li>
              📌 <strong>Compras:</strong> 10%
            </li>
            <li>
              📌 <strong>Viajes:</strong> 15%
            </li>
            <li>
              📌 <strong>Otros:</strong> 10% (Para lo que no encaje en las demás
              categorías)
            </li>
          </ul>

          <Typography variant="body1" textAlign="center" fontSize="14px">
            Recuerda que <strong>‘Otros’</strong> te permite personalizar aún
            más tu presupuesto. ¡Vamos a organizarnos mejor! 🚀
          </Typography>
        </Box>
      ),
      STEP5: step5Message,
      STEP6: (
        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            ¿Y ahora qué sigue? 🤔
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginTop: "8px", fontSize: "15px" }}
          >
            Ahora es momento de{" "}
            <strong>registrar cada uno de tus gastos</strong> en las categorías
            que definimos.
          </Typography>
          <Typography variant="body1" sx={{ marginTop: "8px" }}>
            Al final de cada mes,{" "}
            <strong>recibirás un informe detallado</strong> en tu correo 📩 con
            un resumen de cómo administraste tu dinero, las categorías más
            gastadas y sugerencias para mejorar. 📊✨
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginTop: "12px", fontWeight: "bold" }}
          >
            ¡Empieza a registrar tus gastos y toma el control de tus finanzas!
            🚀
          </Typography>
        </Box>
      ),
    },
  };
};
