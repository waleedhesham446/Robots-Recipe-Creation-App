import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import client from '../api/client'
import { Recipe } from '../models/recipe'
import { Page } from '../models/pagination'

export const fetchRecipes = async (search: string, page: number, pageSize: number): Promise<Page<Recipe>> => {
  const res = await client.get<Page<Recipe>>('/recipes', {
    params: {
      search,
      page,
      page_size: pageSize,
    },
  })
  return res.data
}

export default function useRecipes(
  search: string = '',
  page: number = 1,
  pageSize: number = 10,
  options?: UseQueryOptions<Page<Recipe>, Error, Page<Recipe>, ['recipes']>,
): UseQueryResult<Page<Recipe>, Error> {
  return useQuery<Page<Recipe>, Error, Page<Recipe>, ['recipes']>({
    queryKey: ['recipes', search, page, pageSize],
    queryFn: () => fetchRecipes(search, page, pageSize),
    ...options,
  } as UseQueryOptions<Page<Recipe>, Error, Page<Recipe>, ['recipes']>)
}
