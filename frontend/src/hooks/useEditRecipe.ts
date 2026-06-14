import { useMutation, UseMutationResult } from '@tanstack/react-query'
import client from '../api/client'
import { Step } from '../models/steps'
import { Recipe } from '../models/recipe'

export type EditRecipePayload = {
  name?: string
  description?: string
  steps?: Array<Step>
}

async function editRecipe(id: string, payload: EditRecipePayload): Promise<Recipe> {
  const res = await client.patch(`/recipes/${id}`, payload)
  return res.data
}

export default function useEditRecipe(): UseMutationResult<Recipe, unknown, { id: string; payload: EditRecipePayload }, unknown> {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EditRecipePayload }) =>
      editRecipe(id, payload),
  })
}
