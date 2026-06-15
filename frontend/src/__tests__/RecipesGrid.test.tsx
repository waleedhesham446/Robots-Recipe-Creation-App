import React from 'react'
import { render, screen } from '@testing-library/react'
import RecipesGrid from '../pages/RecipesGrid'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('../hooks/useRecipes', () => {
  return {
    default: () => ({
      data: { items: [{ id: '1', name: 'Test Recipe', description: 'A great recipe' }], total: 1 },
      error: null,
      isLoading: false,
    }),
  }
})

describe('RecipesGrid', () => {
  it('renders recipe cards from hook data', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <RecipesGrid />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument()
    expect(screen.getByText(/A great recipe/i)).toBeInTheDocument()
  })
})
