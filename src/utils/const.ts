export const EXPENSES_CATEGORY = [
  "Transporte",
  "Comida",
  "Ocio",
  "Compras",
  "Viajes",
  "Otros",
];

export const CATEGORIES_MAP = [
  { id: "Transporte", label: "Transporte", icon: "🚌" },
  { id: "Comida", label: "Comida", icon: "🍔" },
  { id: "Ocio", label: "Ocio", icon: "🎮" },
  { id: "Compras", label: "Compras", icon: "🛋️" },
  { id: "Viajes", label: "Viajes", icon: "✈️" },
  { id: "Otros", label: "Otros", icon: "🔹" },
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
