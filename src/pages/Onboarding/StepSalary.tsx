import { Box, TextField, Typography, useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";
import ChatBubble from "../../components/ChatBubble";
import StepNavigationBtn from "../../components/StepNavigationBtn";

interface StepSalaryProps {
  onNext: () => void;
  onBack: () => void;
  setValue: (name: string, value: any) => void;
}

const StepSalary = ({ onNext, onBack, setValue }: StepSalaryProps) => {
  const theme = useTheme();
  const { register, watch } = useFormContext();
  const salary = watch("salary", ""); // Se actualiza en tiempo real
  const name = watch("name", "");

  const handleNext = () => {
    setValue("salary", Number(salary));
    onNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color={theme.palette.customColors.black}
      >
        ¿Cuál es tu sueldo mensual? 💰
      </Typography>

      <TextField
        {...register("salary")}
        type="text"
        label="Tu salario"
        variant="outlined"
        value={salary ? salary.toLocaleString("es-ES") : ""} // Formateo en tiempo real
        onChange={(e) => {
          const rawValue = e.target.value.replace(/\D/g, ""); // Solo permite números
          setValue("salary", rawValue ? Number(rawValue) : ""); // Guarda el número limpio
        }}
        fullWidth
      />

      <StepNavigationBtn
        onBack={onBack}
        onNext={handleNext}
        disabled={!salary}
      />

      <ChatBubble
        text={`Eh... esto es un poco incómodo ${name}, pero... ¿me podrías decir cuál es tu sueldo mensual? Sin eso, no podré ayudarte. Es importante para que puedas aprovechar al máximo la app.  Prometo guardar el secreto mejor que un banco suizo. ¡Palabra de Arturo! 💰🤫`}
      />
    </Box>
  );
};

export default StepSalary;
