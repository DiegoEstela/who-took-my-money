export const handleAmountChange = (
  key: string,
  value: string,
  setFixedExpenses: any,
  setErrors: (
    callback: (prev: Record<string, boolean>) => Record<string, boolean>
  ) => void
) => {
  setFixedExpenses((prev: any) => {
    let updatedExpenses = { ...prev };

    // 🔹 Permitir solo números y hasta dos decimales
    const amount = value.replace(/[^0-9.]/g, "");
    const validAmount = amount.match(/^\d*\.?\d{0,2}$/)
      ? amount
      : prev[key]?.toString();

    updatedExpenses[key] = validAmount || ""; // Permitir que el usuario escriba sin perder el estado

    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: parseFloat(validAmount || "0") <= 0,
    }));

    return updatedExpenses;
  });
};

export const handleAmountBlur = (
  key: string,
  value: string,
  setFixedExpenses: any
) => {
  const formattedValue = parseFloat(value || "0").toFixed(2);
  setFixedExpenses((prev: any) => ({
    ...prev,
    [key]: isNaN(parseFloat(formattedValue)) ? "0.00" : formattedValue,
  }));
};
