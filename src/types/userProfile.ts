export interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
  salary: number;
  currency: string;
  timestamp: any;
  fixedExpenses: Record<string, number>;
  variableExpenses: Record<string, { amount: number; percentage: number }>;
  remainingAmount: number;
}
