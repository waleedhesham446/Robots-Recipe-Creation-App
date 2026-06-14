import { StepType } from "./enum"
import { TakeImage } from "./take-image"
import { Unscrewing } from "./unscrewing"

interface StepBase {
  id: string
  name: string
  description?: string
  step_type: StepType
  order_index: number
  properties: TakeImage | Unscrewing
}

export interface TakeImageStep extends StepBase {
  step_type: StepType.take_image
  properties: TakeImage
}

export interface UnscrewingStep extends StepBase {
  step_type: StepType.unscrewing
  properties: Unscrewing
}

export type Step = TakeImageStep | UnscrewingStep