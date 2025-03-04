import { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

import StepWelcome from "./StepWelcome";
import Loading from "../../components/Loading";
import useCheckUser from "../../hooks/useCheckUser";
import BookBackground from "../../components/BookBackgound";
import StepSalary from "./StepSalary";
import StepFixedExpenses from "./StepFixedExpenses";

// Definir la estructura de los datos del formulario
type OnboardingFormData = {
  name: string;
  salary?: number;
  fixedExpenses?: number;
  variableExpenses?: number;
};

// Lista de pasos dinámicos con la estructura correcta
const steps = [
  { key: "name", component: StepWelcome },
  { key: "salary", component: StepSalary },
  { key: "fixedExpenses", component: StepFixedExpenses },
];

const Onboarding = () => {
  const { userExists, loading, checkingUser, saveUserToFirestore } =
    useCheckUser();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Hook Form - Control del estado del formulario
  const methods = useForm<OnboardingFormData>({
    defaultValues: {
      name: "",
      salary: undefined,
    },
  });

  const { handleSubmit, getValues, setValue } = methods;

  console.log(getValues());

  // Redirección automática si el usuario ya existe
  useEffect(() => {
    if (userExists) navigate("/home");
  }, [userExists, navigate]);

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

  const handleFinish = () => {
    handleSubmit(saveUserToFirestore as SubmitHandler<OnboardingFormData>)();
  };

  const CurrentStepComponent = steps[activeStep]?.component || null;

  return (
    <FormProvider {...methods}>
      <BookBackground>
        {/* Contador de pasos */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          {activeStep + 1}/{steps.length}
        </Box>

        <Box sx={{ maxWidth: 600, mx: "auto", py: 4 }}>
          {CurrentStepComponent && (
            <CurrentStepComponent
              onNext={handleNext}
              onBack={handleBack}
              setValue={(name, value) =>
                setValue(name as keyof OnboardingFormData, value)
              }
              getValues={getValues}
            />
          )}
        </Box>
      </BookBackground>
    </FormProvider>
  );
};

export default Onboarding;
