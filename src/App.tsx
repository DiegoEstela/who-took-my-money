import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./db/firebase";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import { NotificationProvider } from "./context/NotificationPopup";

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Cargando...</div>;

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;
