import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

/**
 * Obtiene los datos básicos del usuario desde Firestore.
 * @param userId - ID del usuario autenticado en Firebase.
 * @returns Un objeto con los datos del usuario o `null` si no existe.
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
        email: userData.email || "Sin email",
        avatar: userData.avatar || null, // Si en el futuro agregamos avatares
      };
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    return null;
  }
};
