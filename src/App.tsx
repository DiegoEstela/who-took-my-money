import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./db/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Onboarding from "./pages/Onboarding/Onboarding";
import { NotificationProvider } from "./context/NotificationPopup";
import Loading from "./components/Loading";

const App = () => {
  const [user, loading] = useAuthState(auth);
  const [checkingUser, setCheckingUser] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    if (!user) {
      setCheckingUser(false);
      return;
    }

    const checkUserInFirestore = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserExists(true);
      }
      setCheckingUser(false);
    };

    checkUserInFirestore();
  }, [user, db]);

  if (loading || checkingUser) return <Loading />;

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/"
            element={
              user ? (
                userExists ? (
                  <Home />
                ) : (
                  <Navigate to="/onboarding" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/onboarding"
            element={user ? <Onboarding /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;
