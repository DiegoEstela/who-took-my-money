import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../db/firebase";

export const saveExpenseToDB = async (
  userId: string,
  expense: { category: string; amount: number; description: string },
  showNotification: any
) => {
  if (!userId) {
    console.error("❌ No se pudo obtener el UID del usuario.");
    showNotification(
      "error",
      "No se pudo guardar el gasto. Inicia sesión e inténtalo de nuevo."
    );
    return;
  }

  try {
    // Ahora se guarda en users/{uid}/expenses/
    const expensesRef = collection(db, `users/${userId}/expenses`);
    await addDoc(expensesRef, {
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      date: Timestamp.now(), // ✅ Cambio a 'date' para que coincida con la consulta
    });

    showNotification("success", "¡Gasto agregado con éxito! 🎉");
  } catch (error) {
    console.error("❌ Error al guardar en Firestore:", error);
    showNotification("error", "Hubo un problema al guardar el gasto. ❌");
  }
};
