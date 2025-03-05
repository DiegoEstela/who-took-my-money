import { useMemo } from "react";

const useFinancialProfile = (
  variableExpenses: Record<string, { percentage: number; amount: number }>
) => {
  return useMemo(() => {
    let totalAhorro = variableExpenses.Ahorro?.percentage || 0;
    let totalOcio =
      (variableExpenses.Ocio?.percentage || 0) +
      (variableExpenses.Compras?.percentage || 0) +
      (variableExpenses.Viajes?.percentage || 0);

    let perfil = "";
    let mensajeArturo = "";

    if (totalAhorro >= 30) {
      perfil = "El Ahorrista Radical 🏦💰";
      mensajeArturo = `¡Wow! Se nota que estás ahorrando para el apocalipsis financiero. 💸 No está mal ser precavido, pero recuerda que también puedes disfrutar un poco. ¡Un gustito de vez en cuando no mata! 😉`;
    } else if (totalOcio >= 50) {
      perfil = "El Disfrutón Profesional 🍾✈️";
      mensajeArturo = `¡Vaya, ${perfil}! Se nota que sabes cómo vivir la vida. 🌍🎉 Gastar en experiencias está genial, pero no te olvides de guardar un poquito para el futuro... ¡o al menos para cuando tu tarjeta te mire feo! 😂`;
    } else {
      perfil = "El Equilibrado Zen ⚖️🧘";
      mensajeArturo = `¡Felicidades! Tienes un balance casi perfecto en tus finanzas. 🏆 Te das tus gustos, pero también piensas en el futuro. Arturo aprueba este presupuesto con ⭐ 5 estrellas. ¡Sigue así! 🚀`;
    }

    return { perfil, mensajeArturo };
  }, [variableExpenses]);
};

export default useFinancialProfile;
