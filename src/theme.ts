import { createTheme, ThemeOptions } from "@mui/material/styles";

// 🔹 Extender el tema sin sobrescribir las propiedades de Material UI
declare module "@mui/material/styles" {
  interface CustomBackground {
    primary: string;
    secondary: string;
  }

  interface Palette {
    customColors: {
      black: string;
      white: string;
    };
    customBackground: CustomBackground;
  }

  interface PaletteOptions {
    customColors?: {
      black: string;
      white: string;
    };
    customBackground?: CustomBackground;
  }
}

const theme = createTheme({
  palette: {
    primary: { main: "#1B5E20" }, //  Verde musgo oscuro
    secondary: { main: "#03dac6" }, //  Verde agua
    text: {
      primary: "#1B5E20", //  Verde musgo (para texto principal)
      secondary: "#4CAF50", //  Verde claro (para subtítulos o detalles)
      disabled: "#9E9E9E", //  Gris (para texto deshabilitado)
    },
    background: {
      default: "#f4f4f4", //  Fondo base claro
      paper: "#EAE7DC", //  Simula un tono pergamino
    },
    customBackground: {
      primary: "linear-gradient(135deg,rgb(26, 133, 124),rgb(56, 195, 181))", //  Verde musgo a verde claro
      secondary: "linear-gradient(135deg, #FFD700, #FFA500)", //  Dorado a naranja
    },
    customColors: {
      black: "#000000", //  Negro puro
      white: "#FFFFFF", //  Blanco puro
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
} as ThemeOptions);

export default theme;
