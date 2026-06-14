import { Step } from "./steps"

export interface Recipe {
  id: string
  name: string
  description?: string
  image_url?: string
  version: number
  created_at: string
  updated_at: string
  steps: Array<Step>
}