export interface UserProfile {
  name: string;
  ahorro: number;
  avatar: string | null;
  salary: number;
  currency: string;
  timestamp: any;
  fixedExpenses: Record<string, number>;
  variableExpenses: Record<string, { amount: number; percentage: number }>;
  remainingAmount: number;
}

export interface StepOnBoarding {
  onNext: () => void;
  onBack: () => void;
  setValue: (name: string, value: any) => void;
  getValues: () => any;
  watch: (field: string) => any;
}
