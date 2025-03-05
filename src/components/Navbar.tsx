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
import LogoutIcon from "@mui/icons-material/Logout";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home"; // 🔹 Importamos el icono de Casa
import { signOut } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/fetchUserProfile";
import { auth } from "../db/firebase";

const Navbar = () => {
  const theme = useTheme();
  const [openSidebar, setOpenSidebar] = useState(false);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();
  const location = useLocation(); // 🔹 Obtener la ruta actual

  const { data, isLoading } = useQuery({
    queryKey: ["userProfileData", userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });

  const userName = data?.name || "";
  const avatarInitial = userName ? userName.charAt(0).toUpperCase() : "U";

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      {/* Navbar fijo */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#1976D2", width: "100%", zIndex: 1201 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Botón para abrir Sidebar */}
          <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>

          {/* Mostrar Avatar o Casa según la ruta */}
          <IconButton
            onClick={() =>
              navigate(location.pathname === "/profile" ? "/" : "/profile")
            }
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : location.pathname === "/profile" ? (
              <HomeIcon sx={{ color: "#fff", fontSize: 30 }} /> // 🔹 Icono de Casa cuando estamos en "/profile"
            ) : (
              <Avatar sx={{ bgcolor: "#4CAF50" }}>{avatarInitial}</Avatar> // 🔹 Avatar en cualquier otra página
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
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
              <ListItemButton>
                <AddIcon sx={{ marginRight: 1, color: "#1976D2" }} />
                <ListItemText primary="Agregar Gastos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <EditIcon sx={{ marginRight: 1, color: "#4CAF50" }} />
                <ListItemText primary="Editar Gastos Fijos" />
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

          {/* Botón de Cerrar Sesión */}
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

          {/* Firma */}
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
