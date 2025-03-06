import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import ChatBubble from "../../components/ChatBubble";
import StepNavigationBtn from "../../components/StepNavigationBtn";
import { getArturoTexts } from "../../utils/arturoTexts";

interface StepSalaryProps {
  onNext: () => void;
  onBack: () => void;
  setValue: (name: string, value: any) => void;
}

const StepSalary = ({ onNext, onBack, setValue }: StepSalaryProps) => {
  const theme = useTheme();
  const { register, watch } = useFormContext();
  const salary = watch("salary", "");
  const currency = watch("currency", "USD"); // Valor por defecto
  const name = watch("name", "");
  const ARTURO_TEXT = getArturoTexts(name);

  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 4000); // Desaparece en 4 segundos
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setValue("salary", parseFloat(salary).toFixed(2)); // Guarda el salario con 2 decimales
    onNext();
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Permite solo números y un punto decimal

    // Evitar múltiples puntos decimales
    if ((rawValue.match(/\./g) || []).length > 1) {
      return;
    }

    // Limitar a dos decimales
    const parts = rawValue.split(".");
    if (parts.length === 2 && parts[1].length > 2) {
      rawValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    setValue("salary", rawValue);
  };

  const handleBlur = () => {
    if (salary) {
      setValue("salary", parseFloat(salary).toFixed(2)); // Asegura formato con 2 decimales al salir del input
    }
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
      <ChatBubble
        text={ARTURO_TEXT.ONBOARDING.STEP2}
        onButtonClick={() => setShowBubble(false)}
        isVisible={showBubble}
      />

      <Typography
        variant="h5"
        fontWeight="bold"
        color={theme.palette.customColors.black}
      >
        ¿Cuál es tu sueldo mensual? 💰
      </Typography>

      {/* Campo de salario */}
      <TextField
        {...register("salary")}
        type="text"
        label="Tu salario"
        variant="outlined"
        value={salary}
        onChange={handleSalaryChange}
        onBlur={handleBlur} // Formatea a 2 decimales al perder el foco
        fullWidth
      />

      {/* Selector de moneda */}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="currency-label" sx={{ top: "-8px" }}>
          Moneda
        </InputLabel>
        <Select
          labelId="currency-label"
          value={currency}
          onChange={(e) => setValue("currency", e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Selecciona una moneda
          </MenuItem>
          <MenuItem value="USD">Dólar (USD)</MenuItem>
          <MenuItem value="EUR">Euro (EUR)</MenuItem>
          <MenuItem value="ARS">Peso Argentino (ARS)</MenuItem>
          <MenuItem value="MXN">Peso Mexicano (MXN)</MenuItem>
          <MenuItem value="COP">Peso Colombiano (COP)</MenuItem>
          <MenuItem value="CLP">Peso Chileno (CLP)</MenuItem>
          <MenuItem value="BRL">Real Brasileño (BRL)</MenuItem>
        </Select>
      </FormControl>

      <StepNavigationBtn
        onBack={onBack}
        onNext={handleNext}
        disabled={!salary || !currency}
      />
    </Box>
  );
};

export default StepSalary;
