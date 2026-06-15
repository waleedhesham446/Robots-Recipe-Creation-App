import { useMutation, UseMutationResult } from '@tanstack/react-query'
import client from '../api/client'
import { Recipe } from '../models/recipe'

async function deleteRecipe(id: string): Promise<Recipe> {
  const res = await client.delete(`/recipes/${id}`)
  return res.data
}

export default function useDeleteRecipe(): UseMutationResult<Recipe, unknown, string, unknown> {
  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
  })
}
