import { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCheckUser from "../../hooks/useCheckUser";
import { fetchUserExpenses } from "../../services/fetchUserExpenses";
import { EXPENSES_CATEGORY } from "./../../utils/const";

export default function ExpenseHistory() {
  const { user } = useCheckUser();
  const [selectedCategory, setSelectedCategory] = useState(
    EXPENSES_CATEGORY[0]
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const { data: expenses = [], refetch } = useQuery({
    queryKey: ["userExpenses", user?.uid],
    queryFn: () => fetchUserExpenses(user?.uid!, firstDayOfMonth, today),
    enabled: !!user?.uid,
  });

  useEffect(() => {
    refetch();
  }, [selectedCategory, refetch]);

  const filteredExpenses = expenses.filter(
    (expense: any) => expense.category === selectedCategory
  );

  const handleChangePage = (event: any, newPage: any) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Select
        fullWidth
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{
          mb: 2,
          backgroundColor: "rgba(255, 255, 255, 0.3)", // Fondo sutilmente transparente
          borderRadius: 2,
          fontSize: "0.9rem",
          color: "#fff", // Texto blanco para contraste
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        }}
        size="small"
      >
        {EXPENSES_CATEGORY.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>

      <TableContainer
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          minHeight: "62vh",
          overflowX: "hidden",
          maxWidth: "90vw",
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          >
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  color: "#fff",
                  padding: "4px 6px",
                  minWidth: "80px",
                  maxWidth: "100px",
                  lineHeight: "1,4",
                  whiteSpace: "nowrap",
                }}
              >
                Fecha
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  color: "#fff",
                  padding: "4px 6px",
                  minWidth: "80px",
                  maxWidth: "100px",
                  lineHeight: "1,4",
                  whiteSpace: "nowrap",
                }}
              >
                Descripción
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  color: "#fff",
                  padding: "4px 6px",
                  minWidth: "80px",
                  maxWidth: "100px",
                  lineHeight: "1,4",
                  whiteSpace: "nowrap",
                }}
              >
                Monto
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ color: "#fff", fontSize: "0.9rem", padding: "12px" }}
                >
                  No hay gastos este mes
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((expense: any) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "0.85rem",
                        color: "#fff",
                        padding: "4px 6px",
                        minWidth: "80px",
                        maxWidth: "100px",
                        lineHeight: "1.4",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {expense.date?.toDate
                        ? expense.date.toDate().toLocaleDateString("es-ES")
                        : "Fecha inválida"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "0.85rem",
                        color: "#fff",
                        padding: "4px 6px",
                        minWidth: "80px",
                        maxWidth: "100px",
                        lineHeight: "1.4",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {expense.description.length > 30
                        ? `${expense.description.substring(0, 30)}...`
                        : expense.description}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "0.85rem",
                        color: "#fff",
                        padding: "4px 6px",
                        minWidth: "80px",
                        maxWidth: "100px",
                        lineHeight: "1.4",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ overflowX: "hidden", maxWidth: "90vw", maxHeight: "90vh" }}
        component="div"
        count={filteredExpenses.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />
    </Box>
  );
}
