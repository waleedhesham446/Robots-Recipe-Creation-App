import React, { useEffect, useState } from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Recipe } from '../models/recipe'
import { Link, useNavigate } from 'react-router'
import moment from 'moment'
import axios from 'axios'

export default function RecipeCard({
  recipe,
  onDelete,
}: {
  recipe: Recipe
  onDelete?: (recipe: Recipe) => void
}): JSX.Element {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [imageUrl, setImageUrl] = useState<string>(recipe.image_url || 'https://placehold.co/600x400')
  const menuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleMenuClose()
    navigate(`/view/${recipe.id}`)
  }

  const handleDelete = () => {
    handleMenuClose()
    onDelete?.(recipe)
  }

  useEffect(() => {
    if (recipe && !recipe.image_url) {
      axios.get('https://random.imagecdn.app/v1/image?width=400&height=250').then((res) => {
        console.log('Fetched image URL:', res.data)
        setImageUrl(res.data)
      }).catch(() => {
        setImageUrl('https://picsum.photos/200')
      })
    }
  }, [recipe])

  return (
    <Card sx={{ height: 320, display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="img" height="140" image={imageUrl} alt={recipe.name || 'Recipe'} />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h6" noWrap sx={{ flex: 1 }} title={recipe.name}>
            {recipe.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
            <Chip label={`v${recipe.version}`} size="small" />
            <IconButton
              aria-label="Recipe actions"
              aria-controls={menuOpen ? 'recipe-actions-menu' : undefined}
              aria-haspopup="true"
              size="small"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              id="recipe-actions-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteOutlineIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          title={recipe.description}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mt: 1,
          }}
        >
          {recipe.description || ''}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Updated {moment(recipe.updated_at).fromNow()}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: 'auto' }}>
        <Button component={Link} to={`/view/${recipe.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  )
}