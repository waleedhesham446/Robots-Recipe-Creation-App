import { StepType } from "../models/steps/enum";

export default function buildPayload(recipe: any, steps: Array<any>) {
  return {
    name: recipe.name,
    description: recipe.description || null,
    steps: steps.map((step) => {
      const properties =
        step.step_type === StepType.take_image
          ? {
              include_pointcloud: step.include_pointcloud,
              image_scope: step.image_scope,
              ...(step.image_scope === "section"
                ? {
                    center_x: Number(step.center_x),
                    center_y: Number(step.center_y),
                  }
                : {}),
            }
          : {
              unscrewing_mode: step.unscrewing_mode,
              ...(step.unscrewing_mode === "specific"
                ? {
                    coordinate_x: Number(step.coordinate_x),
                    coordinate_y: Number(step.coordinate_y),
                  }
                : {}),
            };

      return {
        step_type: step.step_type,
        name: step.name,
        description: step.description || null,
        properties,
      };
    }),
  };
}