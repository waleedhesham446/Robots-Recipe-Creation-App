import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import useRecipes from '../hooks/useRecipes'
import {
  Grid,
  CircularProgress,
  Alert,
  Box,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RecipeCard from '../components/RecipeCard'
import { Recipe } from '../models/recipe'
import useDeleteRecipe from '../hooks/useDeleteRecipe'
import { useQueryClient } from '@tanstack/react-query'

export default function RecipesGrid(): JSX.Element {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
  const pageSize = 12

  const { mutate: deleteRecipe } = useDeleteRecipe()

  const handleDelete = (recipe: Recipe) => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      deleteRecipe(recipe.id, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['recipes'] })
        },
        onError: () => {
          alert('Failed to delete recipe')
        },
      })
    }
  }

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams(searchInput ? { search: searchInput, page: '1' } : {})
    }, 450)
    return () => clearTimeout(t)
  }, [searchInput, setSearchParams])

  const { data, error, isLoading } = useRecipes(search, page, pageSize)
  const { items: recipes = [], total = 0 } = data || {}

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
        <TextField
          size="small"
          placeholder="Search recipes"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton size="small" edge="start">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {
        isLoading ? (
          <Box display="flex" justifyContent="center"><CircularProgress /></Box>
        ) : 
        error ? (
          <Alert severity="error">Failed to load recipes</Alert>
        ) : (
          <>
            <Grid container spacing={2}>
              {recipes.map((r: Recipe) => (
              <Grid item key={r.id} xs={12} sm={6} md={4} lg={3}>
                <RecipeCard recipe={r} onDelete={handleDelete} />
              </Grid>
              ))}
            </Grid>
            
            <Box display="flex" justifyContent="center" mt={8}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, p) => {
                  // build a params object from current searchParams and override page
                  const entries = Object.fromEntries(Array.from(searchParams.entries()))
                  entries.page = p.toString()
                  setSearchParams(entries)
                }}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )
      }
    </Box>
  )
}
