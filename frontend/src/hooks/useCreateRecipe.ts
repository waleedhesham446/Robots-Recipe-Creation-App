import { useMutation, UseMutationResult } from '@tanstack/react-query'
import client from '../api/client'
import { Step } from '../models/steps'
import { Recipe } from '../models/recipe'

export type CreateRecipePayload = {
  name: string
  description?: string
  steps: Array<Step>
}

async function createRecipe(payload: CreateRecipePayload): Promise<Recipe> {
  const res = await client.post('/recipes', payload)
  return res.data
}

export default function useCreateRecipe(): UseMutationResult<Recipe, unknown, CreateRecipePayload, unknown> {
  return useMutation({
    mutationFn: createRecipe,
  })
}
