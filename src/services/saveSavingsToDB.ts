import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../db/firebase";

export const saveSavingsToDB = async (
  userId: string,
  savingsAmount: number,
  showNotification: any
) => {
  if (!userId) {
    console.error("❌ No se pudo obtener el UID del usuario.");
    showNotification(
      "error",
      "No se pudo guardar el ahorro. Inicia sesión e inténtalo de nuevo."
    );
    return;
  }

  try {
    // Guardamos los ahorros en `users/{uid}/savings/`
    const savingsRef = collection(db, `users/${userId}/savings`);
    await addDoc(savingsRef, {
      amount: savingsAmount,
      date: Timestamp.now(), // Se guarda la fecha actual
    });

    showNotification("success", "¡Ahorro guardado con éxito! 🎉");
  } catch (error) {
    console.error("❌ Error al guardar en Firestore:", error);
    showNotification("error", "Hubo un problema al guardar el ahorro. ❌");
  }
};
