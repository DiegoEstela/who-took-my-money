import { db } from "../db/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { ORDERED_CATEGORIES } from "../utils/const";

export const fetchUserData = async (userId: string) => {
  if (!userId) throw new Error("Usuario no autenticado");

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("No se encontraron datos del usuario.");
  }

  const userData = userSnap.data();
  let variableExpenses = userData.variableExpenses ?? {};

  const expensesRef = collection(db, `users/${userId}/expenses`);
  const expensesSnap = await getDocs(expensesRef);

  const realExpenses: Record<string, number> = {};

  expensesSnap.forEach((doc) => {
    const { category, amount } = doc.data();
    realExpenses[category] = (realExpenses[category] || 0) + amount; // Acumular montos por categoría
  });

  // 🔹 Obtener total de ahorros desde Firestore
  const savingsRef = collection(db, `users/${userId}/savings`);
  const savingsSnap = await getDocs(savingsRef);

  let totalSavings = 0;
  savingsSnap.forEach((doc) => {
    totalSavings += doc.data().amount;
  });

  // 🔹 Agregar "Ahorros" como una categoría en último lugar
  variableExpenses["Ahorros"] = { amount: userData.savings || 0 }; // Ahorro presupuestado
  realExpenses["Ahorros"] = totalSavings; // Ahorro real acumulado

  variableExpenses = Object.fromEntries(
    ORDERED_CATEGORIES.map((category) => [
      category,
      variableExpenses[category] || { amount: 0 }, // Si la categoría no existe, se inicializa con 0
    ])
  );

  const sortedRealExpenses = Object.fromEntries(
    ORDERED_CATEGORIES.map((category) => [
      category,
      realExpenses[category] || 0, // Si la categoría no existe, se inicializa con 0
    ])
  );

  return { variableExpenses, realExpenses: sortedRealExpenses };
};
