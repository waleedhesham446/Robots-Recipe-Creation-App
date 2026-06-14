import React from 'react'
import { Container, Box, Typography, Button, AppBar, Toolbar } from '@mui/material'
import { Routes, Route, Link, useLocation } from 'react-router'
import RecipesGrid from './pages/RecipesGrid'
import CreateRecipe from './pages/CreateRecipe'

export default function App(): JSX.Element {
  const location = useLocation();

  return (
    <Container maxWidth="lg" sx={{ pb: 1 }}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Recipes Creation App
          </Typography>
          {location.pathname === '/create' || location.pathname.startsWith('/view/') ? (
            <Button component={Link} to="/" variant="outlined">Back to Recipes</Button>
          ) : (
            <Button component={Link} to="/create" variant="contained">Create Recipe</Button>
          )}
        </Toolbar>
      </AppBar>
      <Box my={4} sx={{ mt: 12 }}>
        <Routes>
          <Route path="/" element={<RecipesGrid />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/view/:id" element={<CreateRecipe />} />
        </Routes>
      </Box>
    </Container>
  )
}
