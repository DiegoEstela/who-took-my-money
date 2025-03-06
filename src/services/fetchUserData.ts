import { db } from "../db/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export const fetchUserData = async (userId: string) => {
  if (!userId) throw new Error("Usuario no autenticado");

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("No se encontraron datos del usuario.");
  }

  const userData = userSnap.data();
  const variableExpenses = userData.variableExpenses ?? {};

  const expensesRef = collection(db, `users/${userId}/expenses`);
  const expensesSnap = await getDocs(expensesRef);

  const realExpenses: Record<string, number> = {};

  expensesSnap.forEach((doc) => {
    const { category, amount } = doc.data();
    if (realExpenses[category]) {
      realExpenses[category] += amount; // Acumular monto por categoría
    } else {
      realExpenses[category] = amount; // Inicializar categoría
    }
  });

  return { variableExpenses, realExpenses };
};
