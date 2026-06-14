import {
  Stack,
  Typography,
  TextField,
  FormControl,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";


export default function TakeImageFields({ step, errors, onChange }: { step: any; errors: any; onChange: any }) {
  return (
    <Stack spacing={1.5}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={step.include_pointcloud}
            onChange={(e) => onChange({ include_pointcloud: e.target.checked })}
          />
        }
        label="Include pointcloud"
      />

      <FormControl size="small">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Capture area
        </Typography>
        <RadioGroup
          row
          value={step.image_scope}
          onChange={(e) =>
            onChange({
              image_scope: e.target.value,
              center_x: "",
              center_y: "",
            })
          }
        >
          <FormControlLabel
            value="full_battery"
            control={<Radio size="small" />}
            label="Full battery image"
          />
          <FormControlLabel
            value="section"
            control={<Radio size="small" />}
            label="Section of image"
          />
        </RadioGroup>
      </FormControl>

      {step.image_scope === "section" && (
        <Stack direction="row" spacing={2}>
          <TextField
            label="Center X"
            size="small"
            type="number"
            inputProps={{ min: 0 }}
            value={step.center_x}
            onChange={(e) => onChange({ center_x: e.target.value })}
            error={Boolean(errors.center_x)}
            helperText={errors.center_x}
          />
          <TextField
            label="Center Y"
            size="small"
            type="number"
            inputProps={{ min: 0 }}
            value={step.center_y}
            onChange={(e) => onChange({ center_y: e.target.value })}
            error={Boolean(errors.center_y)}
            helperText={errors.center_y}
          />
        </Stack>
      )}
    </Stack>
  );
}
