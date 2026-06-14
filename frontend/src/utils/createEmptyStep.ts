import { StepType } from "../models/steps/enum";

let nextLocalId = 1;
const makeLocalId = () => `local-${nextLocalId++}`;

export default function createEmptyStep(stepType = StepType.take_image) {
  const base = {
    localId: makeLocalId(),
    step_type: stepType,
    name: "",
    description: "",
  };

  if (stepType === StepType.take_image) {
    return {
      ...base,
      include_pointcloud: false,
      image_scope: "full_battery",
      center_x: "",
      center_y: "",
    };
  }

  return {
    ...base,
    unscrewing_mode: "automatic",
    coordinate_x: "",
    coordinate_y: "",
  };
}