import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Onboarding from "./pages/Onboarding/Onboarding";
import { NotificationProvider } from "./context/NotificationPopup";
import Loading from "./components/Loading";
import useCheckUser from "./hooks/useCheckUser";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile/Profile";
import ExpenseEntry from "./pages/ExpenseEntry/ExpenseEntry";
import ExpenseHistory from "./pages/ExpenseHistory/ExpenseHistory";
import Savings from "./pages/Savings/Savings";

const queryClient = new QueryClient();

const App = () => {
  const { user, userExists, loading, checkingUser } = useCheckUser();

  if (loading || checkingUser) return <Loading />;

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <BrowserRouter>
          {user && userExists && <Navbar />}
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/expenseEntry" element={<ExpenseEntry />} />
            <Route path="/expenseHistory" element={<ExpenseHistory />} />
            <Route path="/savings" element={<Savings />} />

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
    </QueryClientProvider>
  );
};

export default App;
