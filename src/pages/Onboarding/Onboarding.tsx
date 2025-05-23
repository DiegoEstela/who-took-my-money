import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Box } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import useCheckUser from "../../hooks/useCheckUser";

import StepWelcome from "./StepWelcome";
import Loading from "../../components/Loading";
import BookBackground from "../../components/BookBackgound";
import StepSalary from "./StepSalary";
import StepFixedExpenses from "./StepFixedExpenses";
import StepCompletion from "./StepCompletion";
import StepFinish from "./StepFinish";
import { db } from "../../db/firebase";
import { useNotification } from "../../context/useNotification";
import StepSavings from "./StepSavings";

type OnboardingFormData = {
  currency: string;
  name: string;
  salary?: number;
  fixedExpenses?: Record<string, number>;
  variableExpenses?: Record<string, { percentage: number; amount: number }>;
  savings?: number;
};

const steps = [
  { key: "name", component: StepWelcome },
  { key: "salary", component: StepSalary },
  { key: "savings", component: StepSavings },
  { key: "fixedExpenses", component: StepFixedExpenses },
  { key: "variableExpenses", component: StepCompletion },
  { key: "finish", component: StepFinish },
];

const Onboarding = () => {
  const { user, loading, checkingUser } = useCheckUser();
  const { showNotification } = useNotification();
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<OnboardingFormData>({
    defaultValues: {
      currency: "USD",
      name: "",
      salary: undefined,
      fixedExpenses: {},
      variableExpenses: {},
    },
  });

  const { getValues, setValue, handleSubmit, watch } = methods;

  if (loading || checkingUser) return <Loading />;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // 📌 Guardar en Firestore con el UID del usuario autenticado
  const handleSaveToDB: SubmitHandler<OnboardingFormData> = async (data) => {
    if (!user?.uid) {
      console.error("No se pudo obtener el UID del usuario.");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...data,
        savings: data.savings || 0, // Guardar ahorro fuera de los gastos
        remainingAmount:
          (data.salary || 0) -
          (data.savings || 0) -
          (data.fixedExpenses?.totalExpenses || 0) -
          Object.values(data.variableExpenses || {}).reduce(
            (sum, exp) => sum + exp.amount,
            0
          ),
        timestamp: new Date(),
      });

      showNotification("success", "¡Tu perfil ha sido creado con éxito! 🎉");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  const CurrentStepComponent = steps[activeStep]?.component || null;

  return (
    <FormProvider {...methods}>
      <BookBackground>
        <Box sx={{ maxWidth: 600, mx: "auto", py: 4 }}>
          {CurrentStepComponent && (
            <CurrentStepComponent
              onNext={handleNext}
              onBack={handleBack}
              setValue={(name, value) =>
                setValue(name as keyof OnboardingFormData, value)
              }
              getValues={getValues}
              handleSaveToDB={() => handleSubmit(handleSaveToDB)()}
              watch={watch}
            />
          )}
        </Box>
      </BookBackground>
    </FormProvider>
  );
};

export default Onboarding;
