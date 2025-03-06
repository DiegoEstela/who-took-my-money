import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Box,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";
import { signOut } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/fetchUserProfile";
import { auth } from "../db/firebase";
import { PAGES_TITLES } from "../utils/const";

// Diccionario de títulos de página

const Navbar = () => {
  const theme = useTheme();
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = auth.currentUser?.uid;

  const { data, isLoading } = useQuery({
    queryKey: ["userProfileData", userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });

  const userName = data?.name || "";
  const avatarInitial = userName ? userName.charAt(0).toUpperCase() : "U";
  const pageTitle = PAGES_TITLES[location.pathname] || "";

  const toggleSidebar = () => setOpenSidebar((prev) => !prev);

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpenSidebar(false); // 🔹 Cierra el sidebar al navegar
  };

  const handleLogout = async () => {
    await signOut(auth);
    setOpenSidebar(false); // 🔹 Cierra el sidebar al cerrar sesión
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#1976D2", zIndex: 900 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
            <MenuIcon sx={{ fontSize: "36px" }} />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: 1.5,
              fontSize: "14px",
            }}
          >
            {pageTitle}
          </Typography>

          <IconButton
            onClick={() =>
              handleNavigation(location.pathname === "/" ? "/profile" : "/")
            }
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : location.pathname === "/" ? (
              <Avatar sx={{ bgcolor: "#4CAF50" }}>{avatarInitial}</Avatar>
            ) : (
              <HomeIcon sx={{ color: "#fff", fontSize: 30 }} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={openSidebar} onClose={toggleSidebar}>
        <Box
          sx={{
            width: 280,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#F4F6F8",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={toggleSidebar}>
              <CloseIcon sx={{ color: "#FF5733" }} />
            </IconButton>
          </Box>

          <List sx={{ flexGrow: 1, paddingTop: 2 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation("/expenseEntry")}>
                <AddIcon sx={{ marginRight: 1, color: "#1976D2" }} />
                <ListItemText primary="Agregar Gastos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation("/expenseHistory")}
              >
                <ReceiptLongIcon sx={{ marginRight: 1, color: "#4CAF50" }} />
                <ListItemText primary="Listado de gastos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton disabled>
                <BlockIcon sx={{ marginRight: 1, color: "#FF9800" }} />
                <ListItemText primary="Compartir Gastos (Próximamente)" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          <Button
            startIcon={<LogoutIcon sx={{ color: "red" }} />}
            onClick={handleLogout}
            sx={{
              margin: 2,
              color: "red",
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#FFECEC" },
            }}
          >
            Cerrar Sesión
          </Button>

          <Typography
            variant="body2"
            color={theme.palette.text.primary}
            align="center"
            sx={{ paddingBottom: 2 }}
          >
            © 2024 FarestLab
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
