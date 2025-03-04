import { db } from "../db/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const fetchUserData = async (userId: string) => {
  if (!userId) throw new Error("Usuario no autenticado");

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("No se encontraron datos del usuario.");
  }

  const userData = userSnap.data();

  // 🔹 Extraer `variableExpenses` del documento del usuario (si existen)
  const variableExpenses = userData.variableExpenses ?? {};

  // 🔹 Nueva query para obtener los gastos reales
  const expensesQuery = query(
    collection(db, "expenses"),
    where("userId", "==", userId)
  );
  const expensesSnap = await getDocs(expensesQuery);

  const realExpenses: Record<string, number> = {};

  expensesSnap.forEach((doc) => {
    const { concept, amount } = doc.data();
    if (realExpenses[concept]) {
      realExpenses[concept] += amount; // Sumar si ya existe
    } else {
      realExpenses[concept] = amount; // Agregar nuevo concepto
    }
  });

  return { variableExpenses, realExpenses }; // 🔹 Ahora devolvemos ambos correctamente
};
