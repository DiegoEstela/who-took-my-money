export const EXPENSES_CATEGORY = [
  "Comida",
  "Transporte",
  "Compras",
  "Ocio",
  "Viajes",
  "Otros",
];

export const CATEGORIES_MAP = [
  { id: "Comida", label: "Comida", icon: "🍔" },
  { id: "Compras", label: "Compras", icon: "🛋️" },
  { id: "Transporte", label: "Transporte", icon: "🚌" },
  { id: "Ocio", label: "Ocio", icon: "🎮" },
  { id: "Viajes", label: "Viajes", icon: "✈️" },
  { id: "Otros", label: "Otros", icon: "🔹" },
];

export const ORDERED_CATEGORIES = [
  "Comida",
  "Compras",
  "Transporte",
  "Viajes",
  "Ocio",
  "Otros",
  "Ahorros",
];

export const PAGES_TITLES: Record<string, string> = {
  "/": "INICIO",
  "/expenseEntry": "AGREGAR GASTOS",
  "/expenseHistory": "LISTADO DE GASTOS",
  "/profile": "PERFIL",
  "/reports": "REPORTES",
  "/settings": "CONFIGURACIÓN",
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", // Dólar
  EUR: "€", // Euro
  ARS: "ARS$", // Peso Argentino
  MXN: "MX$", // Peso Mexicano
  COP: "COL$", // Peso Colombiano
  CLP: "CLP$", // Peso Chileno
  BRL: "R$", // Real Brasileño
};
