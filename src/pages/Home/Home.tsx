import { Button, Container, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../db/firebase";

const Home = () => {
  return (
    <Container>
      <Typography variant="h4">Bienvenido</Typography>
      <Button variant="contained" onClick={() => signOut(auth)}>
        Cerrar sesión
      </Button>
    </Container>
  );
};

export default Home;
