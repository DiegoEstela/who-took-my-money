import { Box, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface StepNavigationBtnProps {
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean; // Controla si se puede avanzar
}

const StepNavigationBtn = ({
  onBack,
  onNext,
  disabled = false,
}: StepNavigationBtnProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        mt: 2,
      }}
    >
      <IconButton onClick={onBack} color="primary">
        <ArrowBack sx={{ fontSize: 40 }} />
      </IconButton>
      <IconButton onClick={onNext} color="primary" disabled={disabled}>
        <ArrowForward sx={{ fontSize: 40 }} />
      </IconButton>
    </Box>
  );
};

export default StepNavigationBtn;
