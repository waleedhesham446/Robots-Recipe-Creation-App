import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateRecipe from '../pages/CreateRecipe'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockMutate = vi.fn().mockResolvedValue({})
vi.mock('../hooks/useCreateRecipe', () => ({
  __esModule: true,
  default: () => ({ mutate: mockMutate, isLoading: false, isError: false }),
}))

describe('CreateRecipe', () => {
  it('submits the form and calls create mutation', async () => {
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
            <CreateRecipe />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const nameInput = screen.getByLabelText(/Recipe Name/i)
    const stepNameInput = screen.getByLabelText(/Step Name/i)
    const submit = screen.getByRole('button', { name: /Create/i })
    console.log('&&&&', submit.textContent)
    await userEvent.type(nameInput, 'New Recipe')
    await userEvent.type(stepNameInput, 'New Step')
    await userEvent.click(submit)

    expect(mockMutate).toHaveBeenCalled()
  })
})
