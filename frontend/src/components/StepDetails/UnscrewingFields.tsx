import {
  Stack,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

export default function UnscrewingFields({ step, errors, onChange }: { step: any; errors: any; onChange: any }) {
  return (
    <Stack spacing={1.5}>
      <FormControl size="small">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Unscrewing mode
        </Typography>
        <RadioGroup
          row
          value={step.unscrewing_mode}
          onChange={(e) =>
            onChange({
              unscrewing_mode: e.target.value,
              coordinate_x: "",
              coordinate_y: "",
            })
          }
        >
          <FormControlLabel
            value="automatic"
            control={<Radio size="small" />}
            label="Automatic unscrewing"
          />
          <FormControlLabel
            value="specific"
            control={<Radio size="small" />}
            label="Specific unscrewing"
          />
        </RadioGroup>
      </FormControl>

      {step.unscrewing_mode === "specific" && (
        <Stack direction="row" spacing={2}>
          <TextField
            label="Coordinate X"
            size="small"
            type="number"
            inputProps={{ min: 0 }}
            value={step.coordinate_x}
            onChange={(e) => onChange({ coordinate_x: e.target.value })}
            error={Boolean(errors.coordinate_x)}
            helperText={errors.coordinate_x}
          />
          <TextField
            label="Coordinate Y"
            size="small"
            type="number"
            inputProps={{ min: 0 }}
            value={step.coordinate_y}
            onChange={(e) => onChange({ coordinate_y: e.target.value })}
            error={Boolean(errors.coordinate_y)}
            helperText={errors.coordinate_y}
          />
        </Stack>
      )}
    </Stack>
  );
}
