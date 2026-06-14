import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import client from '../api/client'
import { Recipe } from '../models/recipe'

export const fetchRecipe = async (id: string): Promise<Recipe> => {
  const res = await client.get<Recipe>(`/recipes/${id}`);
  return res.data
}

export default function useRecipe(
  id: string = '',
  options?: UseQueryOptions<Recipe, Error, Recipe, ['recipes']>
): UseQueryResult<Recipe, Error> {
  return useQuery<Recipe, Error, Recipe, ['recipes']>({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id),
    ...options,
    enabled: !!id
  } as UseQueryOptions<Recipe, Error, Recipe, ['recipes']>)
}
