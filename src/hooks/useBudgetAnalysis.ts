import { useEffect, useState } from "react";

const useBudgetAnalysis = (variableExpenses: any, realExpenses: any) => {
  const [warning, setWarning] = useState<string | null>(null);
  const [inputWarning, setInputWarning] = useState<any>(null);
  const today = new Date();
  const currentDay = today.getDate();
  const totalDays = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  useEffect(() => {
    const warningsList: string[] = [];
    Object.entries(variableExpenses).forEach(([category, data]: any) => {
      const estimatedAmount = data.amount || 0;
      const spentAmount = realExpenses[category] || 0;
      const expectedSpending = (currentDay / totalDays) * estimatedAmount;
      const expensePercentage = (spentAmount / estimatedAmount) * 100;

      if (spentAmount > expectedSpending * 1.2) {
        warningsList.push(
          `⚠️ Cuidado llevas gastado en ${category} un ${expensePercentage.toFixed(
            0
          )}% en ${currentDay} días.`
        );
      }
    });

    if (warningsList.length > 0) {
      setWarning(warningsList[Math.floor(Math.random() * warningsList.length)]);
    } else {
      setWarning(null);
    }
  }, [variableExpenses, realExpenses, currentDay, totalDays]);

  const checkAmountExceeds = (category: any, amount: any) => {
    const remainingBudget =
      (variableExpenses[category]?.amount || 0) - (realExpenses[category] || 0);
    if (amount > remainingBudget) {
      setInputWarning(
        `⚠️ ${category}: Te pasas por $${(amount - remainingBudget).toFixed(
          2
        )}.`
      );
    } else {
      setInputWarning(null);
    }
  };

  return { warning, inputWarning, checkAmountExceeds };
};

export default useBudgetAnalysis;
