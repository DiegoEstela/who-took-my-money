import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Onboarding from "./pages/Onboarding/Onboarding";
import { NotificationProvider } from "./context/NotificationPopup";
import Loading from "./components/Loading";
import useCheckUser from "./hooks/useCheckUser"; // ✅ Importamos el hook actualizado

const App = () => {
  const { user, userExists, loading, checkingUser } = useCheckUser(); // ✅ Ahora `userExists` viene del hook

  // Mientras se chequea el usuario, mostramos una pantalla de carga
  if (loading || checkingUser) return <Loading />;

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />

          {/* Redirección basada en Firestore */}
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
            element={
              user ? (
                userExists ? (
                  <Navigate to="/home" />
                ) : (
                  <Onboarding />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/home"
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
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;
