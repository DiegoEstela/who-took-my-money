import { useEffect, useState } from "react";
import { auth } from "../db/firebase"; // Importa Firebase Auth
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const useCheckUser = () => {
  const [user, loading] = useAuthState(auth);
  const [checkingUser, setCheckingUser] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const checkUserInFirestore = async () => {
      if (!user) {
        setUserExists(false);
        setCheckingUser(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        setUserExists(userSnap.exists());
      } catch (error) {
        console.error("Error verificando usuario en Firestore:", error);
      } finally {
        setCheckingUser(false);
      }
    };

    checkUserInFirestore();
  }, [user, db]);

  return { user, userExists, loading, checkingUser };
};

export default useCheckUser;
