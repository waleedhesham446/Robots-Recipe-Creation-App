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
  Alert,
  Snackbar,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Recipe } from '../models/recipe'
import { Link, useNavigate } from 'react-router'
import moment from 'moment'
import axios from 'axios'
import { DownloadOutlined, ChevronRightOutlined } from '@mui/icons-material'

export default function RecipeCard({
  recipe,
  onDelete,
}: {
  recipe: Recipe
  onDelete?: (recipe: Recipe) => void
}): JSX.Element {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [executeAnchorEl, setExecuteAnchorEl] = useState<null | HTMLElement>(null)
  const [imageUrl, setImageUrl] = useState<string>(recipe.image_url || 'https://placehold.co/600x400')
  const [notification, setNotification] = useState({
    open: false,
    message: '',
  })
  const menuOpen = Boolean(anchorEl)
  const executeMenuOpen = Boolean(executeAnchorEl)


  const showNotification = (message: string) => {
    setNotification({
      open: true,
      message,
    })
  }

  const handleNotificationClose = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }))
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleExecuteOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setExecuteAnchorEl(event.currentTarget);
  }

  const handleExecuteClose = () => {
    setExecuteAnchorEl(null)
  }

  const handleExecuteRobotA = (recipe: Recipe) => {
    handleExecuteClose()
    handleMenuClose()
    // execute Robot A
    showNotification(`Sending recipe '${recipe.name}' to adaptor to run on Robot A (Vendor X)...`)
  }

  const handleExecuteRobotB = (recipe: Recipe) => {
    handleExecuteClose()
    handleMenuClose()
    // execute Robot B
    showNotification(`Sending recipe '${recipe.name}' to adaptor to run on Robot B (Vendor Y)...`)
  }

  const handleExport = () => {
    handleMenuClose()
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recipe, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', `${recipe.name || 'recipe'}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
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
    <>
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
              <MenuItem
                onClick={handleExecuteOpen}
              >
                <ListItemText>Execute</ListItemText>
                <ChevronRightOutlined fontSize="small" />
              </MenuItem>
              <MenuItem onClick={handleExport}>
                <ListItemIcon>
                  <DownloadOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export</ListItemText>
              </MenuItem>
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
            <Menu
              anchorEl={executeAnchorEl}
              open={executeMenuOpen}
              onClose={handleExecuteClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => handleExecuteRobotA(recipe)}>
                Robot A (Vendor X)
              </MenuItem>

              <MenuItem onClick={() => handleExecuteRobotB(recipe)}>
                Robot B (Vendor Y)
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
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={handleNotificationClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Alert
        onClose={handleNotificationClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
    </>
  )
}