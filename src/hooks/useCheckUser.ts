import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../db/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const useCheckUser = () => {
  const [user, loading] = useAuthState(auth);
  const [userExists, setUserExists] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInFirestore = async () => {
      if (loading) return;
      if (!user) {
        setCheckingUser(false);
        navigate("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserExists(true);
        }
      } catch (error) {
        console.error("Error verificando usuario en Firestore:", error);
      } finally {
        setCheckingUser(false);
      }
    };

    checkUserInFirestore();
  }, [user, loading, navigate]);

  const saveUserToFirestore = async (userData: any) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, userData);
        navigate("/home");
      } catch (error) {
        console.error("Error guardando usuario en Firestore:", error);
      }
    }
  };

  return { user, loading, userExists, checkingUser, saveUserToFirestore };
};

export default useCheckUser;
