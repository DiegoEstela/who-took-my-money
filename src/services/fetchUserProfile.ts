import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

/**
 * Obtiene los datos completos del usuario desde Firestore.
 * @param userId - ID del usuario autenticado en Firebase.
 * @returns Un objeto con todos los datos del usuario o `null` si no existe.
 */
export const fetchUserProfile = async (userId: string) => {
  if (!userId) throw new Error("El userId es obligatorio");

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      return {
        name: userData.name || "Usuario",
        ahorro: userData.savings || 0,
        avatar: userData.avatar || null,
        salary: parseFloat(userData.salary) || 0,
        currency: userData.currency || "USD",
        timestamp: userData.timestamp || null,
        fixedExpenses: userData.fixedExpenses || {},
        variableExpenses: userData.variableExpenses || {},
        remainingAmount: parseFloat(userData.remainingAmount) || 0,
      };
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    return null;
  }
};
