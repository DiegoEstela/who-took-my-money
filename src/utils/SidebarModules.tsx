// SIDEBAR MODULES

import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BlockIcon from "@mui/icons-material/Block";
import SavingsIcon from "@mui/icons-material/Savings";
export const MODULES = [
  {
    id: "expenseEntry",
    label: "Agregar Gastos",
    icon: <AddIcon sx={{ marginRight: 1, color: "#1976D2" }} />,
    path: "/expenseEntry",
    order: 1,
    disabled: false,
  },
  {
    id: "expenseHistory",
    label: "Listado de gastos",
    icon: <ReceiptLongIcon sx={{ marginRight: 1, color: "#4CAF50" }} />,
    path: "/expenseHistory",
    order: 2,
    disabled: false,
  },
  {
    id: "expense",
    label: "Compartir Gastos (Próximamente)",
    icon: <BlockIcon sx={{ marginRight: 1, color: "#FF9800" }} />,
    path: "/expenseHistory",
    order: 3,
    disabled: true,
  },
  {
    id: "ahorrar",
    label: "Ahorrar",
    icon: <SavingsIcon sx={{ marginRight: 1, color: "#FF9800" }} />,
    path: "/savings",
    order: 3,
    disabled: false,
    sx: { backgroundColor: "#6eff81" },
  },
];
