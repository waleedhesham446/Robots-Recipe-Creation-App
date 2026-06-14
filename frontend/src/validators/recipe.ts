import { StepType } from "../models/steps/enum";

export default function validateStep(step: any) {
  const errors: any = {};

  if (!step.name?.trim()) {
    errors.name = "Step name is required";
  }

  if (step.step_type === StepType.take_image) {
    if (step.image_scope === "section") {
      if (step.center_x === "" || Number(step.center_x) < 0) {
        errors.center_x = "Enter a non-negative value";
      }
      if (step.center_y === "" || Number(step.center_y) < 0) {
        errors.center_y = "Enter a non-negative value";
      }
    }
  } else {
    if (step.unscrewing_mode === "specific") {
      if (step.coordinate_x === "" || Number(step.coordinate_x) < 0) {
        errors.coordinate_x = "Enter a non-negative value";
      }
      if (step.coordinate_y === "" || Number(step.coordinate_y) < 0) {
        errors.coordinate_y = "Enter a non-negative value";
      }
    }
  }

  return errors;
}