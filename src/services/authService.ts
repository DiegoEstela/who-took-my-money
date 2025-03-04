import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app"; // Importamos FirebaseError
import { auth, provider } from "../db/firebase";

// Función para traducir errores de Firebase
const translateFirebaseError = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "El correo electrónico ya está en uso.",
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
    "auth/user-not-found": "No se encontró una cuenta con este correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/weak-password":
      "La contraseña es demasiado débil. Usa al menos 6 caracteres.",
    "auth/network-request-failed": "Error de conexión. Revisa tu internet.",
    "auth/popup-closed-by-user":
      "El inicio de sesión con Google fue cancelado.",
    "auth/cancelled-popup-request":
      "Se canceló la solicitud de inicio de sesión.",
    "auth/too-many-requests": "Demasiados intentos. Inténtalo más tarde.",
  };

  if (errorMessages[errorCode]) {
    return errorMessages[errorCode];
  }
  return "Ocurrió un error inesperado. Inténtalo de nuevo.";
};

// Registro con correo y contraseña
export const registerUser = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // ✅ Usamos FirebaseError en lugar de AuthError
      throw new Error(translateFirebaseError(error.code));
    }
    throw new Error("Ocurrió un error inesperado.");
  }
};

// Inicio de sesión con correo y contraseña
export const loginUser = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // ✅ Usamos FirebaseError en lugar de AuthError
      throw new Error(translateFirebaseError(error.code));
    }
    throw new Error("Ocurrió un error inesperado.");
  }
};

// Inicio de sesión con Google
export const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // ✅ Usamos FirebaseError en lugar de AuthError
      throw new Error(translateFirebaseError(error.code));
    }
    throw new Error("Ocurrió un error inesperado.");
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo cerrar sesión.");
  }
};
