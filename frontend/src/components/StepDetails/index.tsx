import {
  Box,
  Paper,
  Stack,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TakeImageFields from "./TakeImageFields";
import UnscrewingFields from "./UnscrewingFields";
import { StepType } from "../../models/steps/enum";
import createEmptyStep from "../../utils/createEmptyStep";

const STEP_TYPE_LABELS = {
  [StepType.take_image]: "Take image",
  [StepType.unscrewing]: "Unscrewing",
};

export default function StepCard({ step, index, errors, onChange, onRemove, dragHandleProps }: any) {
  const update = (patch: any) => onChange(step.localId, patch);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box
          {...dragHandleProps}
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.disabled",
            cursor: "grab",
            pt: 0.75,
            "&:active": { cursor: "grabbing" },
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </Box>

        <Stack spacing={2} flex={1}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Chip
              label={`Step ${index + 1}`}
              size="small"
              sx={{
                bgcolor: "rgba(15,110,86,0.08)",
                color: "#0F6E56",
                fontWeight: 500,
                borderRadius: 1,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id={`step-type-label-${step.localId}`}>
                Step type
              </InputLabel>
              <Select
                labelId={`step-type-label-${step.localId}`}
                label="Step type"
                value={step.step_type}
                onChange={(e) => {
                  const newType = e.target.value;
                  const fresh = createEmptyStep(newType);
                  update({
                    ...fresh,
                    localId: step.localId,
                    name: step.name,
                    description: step.description,
                  });
                }}
              >
                {Object.entries(STEP_TYPE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box flex={1} />

            <IconButton
              aria-label="Remove step"
              size="small"
              onClick={() => onRemove(step.localId)}
              sx={{ color: "text.secondary", "&:hover": { color: "#A32D2D" } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Step name"
              size="small"
              fullWidth
              value={step.name}
              onChange={(e) => update({ name: e.target.value })}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Stack>

          <TextField
            label="Description"
            size="small"
            fullWidth
            multiline
            minRows={2}
            value={step.description}
            onChange={(e) => update({ description: e.target.value })}
          />

          <Divider sx={{ my: 0.5 }} />

          {step.step_type === StepType.take_image ? (
            <TakeImageFields step={step} errors={errors} onChange={update} />
          ) : (
            <UnscrewingFields step={step} errors={errors} onChange={update} />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
