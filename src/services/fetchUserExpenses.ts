import { db } from "../db/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const fetchUserExpenses = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  if (!userId) throw new Error("Usuario no autenticado");

  const expensesRef = collection(db, `users/${userId}/expenses`);
  const q = query(
    expensesRef,
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );

  const querySnapshot = await getDocs(q);

  const expenses = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log("Gastos obtenidos:", expenses);
  return expenses;
};
