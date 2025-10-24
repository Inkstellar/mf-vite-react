import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Stack,
  Autocomplete,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  Folder as FolderIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  // Navigation Icons
  HomeRounded,
  DashboardRounded,
  MenuRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
  // Action Icons
  AddRounded,
  EditRounded,
  DeleteRounded,
  SaveRounded,
  SearchRounded,
  SettingsRounded,
  // Communication Icons
  EmailRounded,
  ChatRounded,
  ForumRounded,
  // Content Icons
  LinkRounded,
  ImageRounded,
  DescriptionRounded,
  ArticleRounded,
  // Social Icons
  PersonRounded,
  GroupRounded,
  ShareRounded,
  ThumbUpRounded,
  // Status Icons
  CheckRounded,
  CloseRounded,
  WarningRounded,
  InfoRounded,
  HelpRounded,
  // Security Icons
  LockRounded,
  LockOpenRounded,
  VisibilityRounded,
  VisibilityOffRounded,
  // Notification Icons
  NotificationsRounded,
  NotificationsActiveRounded,
  // File Icons
  FolderRounded,
  InsertDriveFileRounded,
  // Media Icons
  PlayArrowRounded,
  PauseRounded,
  VolumeUpRounded
} from '@mui/icons-material';

interface NavigationItem {
  id?: number;
  path: string;
  label: string;
  icon: string;
  section: string;
}

const Admin: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [formData, setFormData] = useState<NavigationItem>({
    path: '',
    label: '',
    icon: '',
    section: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch navigation items from JSON server
  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/allNav');
      const data = await response.json();
      setNavItems(data);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      setSnackbar({ open: true, message: 'Error fetching navigation items', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof NavigationItem) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle form submission for add/edit
  const handleSubmit = async () => {
    try {
      if (editingItem) {
        // Update existing item
        const response = await fetch(`http://localhost:3001/allNav/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchNavItems();
          setSnackbar({ open: true, message: 'Navigation item updated successfully', severity: 'success' });
          handleCloseDialog();
        } else {
          setSnackbar({ open: true, message: 'Error updating navigation item', severity: 'error' });
        }
      } else {
        // Add new item
        const response = await fetch('http://localhost:3001/allNav', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchNavItems();
          setSnackbar({ open: true, message: 'Navigation item added successfully', severity: 'success' });
          handleCloseDialog();
        } else {
          setSnackbar({ open: true, message: 'Error adding navigation item', severity: 'error' });
        }
      }
    } catch (error) {
      console.error('Error saving navigation item:', error);
      setSnackbar({ open: true, message: 'Error saving navigation item', severity: 'error' });
    }
  };

  // Handle edit
  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setFormData(item);
    // setOpenDialog(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this navigation item?')) {
      try {
        const response = await fetch(`http://localhost:3001/allNav/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchNavItems();
          setSnackbar({ open: true, message: 'Navigation item deleted successfully', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Error deleting navigation item', severity: 'error' });
        }
      } catch (error) {
        console.error('Error deleting navigation item:', error);
        setSnackbar({ open: true, message: 'Error deleting navigation item', severity: 'error' });
      }
    }
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      path: '',
      label: '',
      icon: '',
      section: ''
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      path: '',
      label: '',
      icon: '',
      section: ''
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Material-UI Icons Library
  const iconLibrary = [
    // Navigation Icons
    { name: 'Home', icon: <HomeRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>', category: 'Navigation' },
    { name: 'Dashboard', icon: <DashboardRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>', category: 'Navigation' },
    { name: 'Menu', icon: <MenuRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>', category: 'Navigation' },
    { name: 'Arrow Back', icon: <ArrowBackRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>', category: 'Navigation' },
    { name: 'Arrow Forward', icon: <ArrowForwardRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>', category: 'Navigation' },

    // Action Icons
    { name: 'Add', icon: <AddRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>', category: 'Actions' },
    { name: 'Edit', icon: <EditRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>', category: 'Actions' },
    { name: 'Delete', icon: <DeleteRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>', category: 'Actions' },
    { name: 'Save', icon: <SaveRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V6h10v3z"/></svg>', category: 'Actions' },
    { name: 'Search', icon: <SearchRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>', category: 'Actions' },
    { name: 'Settings', icon: <SettingsRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>', category: 'Actions' },

    // Communication Icons
    { name: 'Email', icon: <EmailRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>', category: 'Communication' },
    { name: 'Chat', icon: <ChatRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>', category: 'Communication' },

    // Content Icons
    { name: 'Link', icon: <LinkRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>', category: 'Content' },
    { name: 'Description', icon: <DescriptionRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>', category: 'Content' },

    // Social Icons
    { name: 'Person', icon: <PersonRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/></svg>', category: 'Social' },
    { name: 'Group', icon: <GroupRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,4C18.2,4 20,5.8 20,8C20,10.2 18.2,12 16,12C13.8,12 12,10.2 12,8C12,5.8 13.8,4 16,4M16,13C12.7,13 4,14.3 4,17V20H28V17C28,14.3 19.3,13 16,13M8,6C10.2,6 12,7.8 12,10C12,12.2 10.2,14 8,14C5.8,14 4,12.2 4,10C4,7.8 5.8,6 8,6M8,15C11.3,15 20,16.3 20,19V22H-4V19C-4,16.3 4.7,15 8,15Z"/></svg>', category: 'Social' },

    // Status Icons
    { name: 'Check', icon: <CheckRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>', category: 'Status' },
    { name: 'Warning', icon: <WarningRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>', category: 'Status' },
    { name: 'Info', icon: <InfoRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H19V9Z"/></svg>', category: 'Status' },

    // Security Icons
    { name: 'Lock', icon: <LockRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18,8H17V6C17,3.24 14.76,1 12,1C9.24,1 7,3.24 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M8.9,6C8.9,4.29 10.29,2.9 12,2.9C13.71,2.9 15.1,4.29 15.1,6V8H8.9V6M16,10V20H8V10H16Z"/></svg>', category: 'Security' },
    { name: 'Visibility', icon: <VisibilityRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5M12,17A4.5,4.5 0 0,1 7.5,12.5A4.5,4.5 0 0,1 12,8A4.5,4.5 0 0,1 16.5,12.5A4.5,4.5 0 0,1 12,17M12,10A2.5,2.5 0 0,0 9.5,12.5A2.5,2.5 0 0,0 12,15A2.5,2.5 0 0,0 14.5,12.5A2.5,2.5 0 0,0 12,10Z"/></svg>', category: 'Security' },

    // File Icons
    { name: 'Folder', icon: <FolderRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/></svg>', category: 'Files' },
    { name: 'Document', icon: <InsertDriveFileRounded />, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>', category: 'Files' }
  ];

  // Group items by section
  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  // Get section icon
  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'Main Navigation':
        return <StarIcon />;
      case 'Remote Services':
        return <FolderIcon />;
      case 'User Management':
        return <PersonIcon />;
      case 'Settings':
        return <SettingsIcon />;
      default:
        return <FolderIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Navigation Admin
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage navigation menu items
      </Typography>


      {/* Tree View Section */}
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2}>
          <Box sx={{width: '60%'}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Current Navigation Items ({navItems.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
              >
                Add New Item
              </Button>
            </Box>

            {navItems.length === 0 ? (
              <Alert severity="info">
                No navigation items found. Add your first item using the form.
              </Alert>
            ) : (
              <SimpleTreeView sx={{ flexGrow: 1, width: '100%' }}>
                {Object.entries(groupedItems).map(([section, items]) => (
                  <TreeItem
                    key={section}
                    itemId={section}
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        {getSectionIcon(section)}
                        <Typography variant="subtitle1">{section}</Typography>
                        <Chip label={items.length} size="small" color="primary" />
                      </Box>
                    }
                  >
                    {items.map((item) => (
                      <TreeItem
                        key={item.id}
                        itemId={`item-${item.id}`}
                        label={
                          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {item.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.path}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(item)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(item.id!)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        }
                      >
                        <TreeItem
                          itemId={`item-${item.id}-details`}
                          label={
                            <Box>
                              <Typography variant="caption" display="block">
                                <strong>Section:</strong> {item.section}
                              </Typography>
                              <Typography variant="caption" display="block">
                                <strong>Icon:</strong>
                              </Typography>
                              <Box
                                component="div"
                                sx={{
                                  mt: 1,
                                  p: 1,
                                  bgcolor: 'grey.50',
                                  borderRadius: 1,
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                dangerouslySetInnerHTML={{ __html: item.icon }}
                              />
                            </Box>
                          }
                        />
                      </TreeItem>
                    ))}
                  </TreeItem>
                ))}
              </SimpleTreeView>
            )}
          </Box>

          {/* Form Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              {editingItem ? 'Edit Navigation Item' : 'Add New Navigation Item'}
            </Typography>

            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Path"
                value={formData.path}
                onChange={handleInputChange('path')}
                placeholder="/example-path"
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Label"
                value={formData.label}
                onChange={handleInputChange('label')}
                placeholder="Display Name"
                margin="normal"
                required
              />

              <Autocomplete
                fullWidth
                options={iconLibrary}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                value={iconLibrary.find(icon => icon.svg === formData.icon) || null}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    icon: typeof newValue === 'string' ? '' : (newValue?.svg || '')
                  }));
                }}
                renderOption={(props, option) => (
                  <ListItem {...props}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {typeof option === 'string' ? null : option.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={typeof option === 'string' ? option : option.name}
                      secondary={typeof option === 'string' ? '' : option.category}
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Icon"
                    placeholder="Search for an icon..."
                    margin="normal"
                    required
                    helperText="Choose from Material-UI rounded icons"
                  />
                )}
                groupBy={(option) => typeof option === 'string' ? '' : option.category}
                freeSolo
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Section</InputLabel>
                <Select
                  value={formData.section}
                  onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                  label="Section"
                >
                  <MenuItem value="Main Navigation">Main Navigation</MenuItem>
                  <MenuItem value="Remote Services">Remote Services</MenuItem>
                  <MenuItem value="User Management">User Management</MenuItem>
                  <MenuItem value="Settings">Settings</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </Button>
                {editingItem && (
                  <Button
                    variant="outlined"
                    onClick={handleCloseDialog}
                    fullWidth
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

        </Stack>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Navigation Item' : 'Add New Navigation Item'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Path"
            value={formData.path}
            onChange={handleInputChange('path')}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Label"
            value={formData.label}
            onChange={handleInputChange('label')}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Icon (SVG)"
            value={formData.icon}
            onChange={handleInputChange('icon')}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Section</InputLabel>
            <Select
              value={formData.section}
              onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
              label="Section"
            >
              <MenuItem value="Main Navigation">Main Navigation</MenuItem>
              <MenuItem value="Remote Services">Remote Services</MenuItem>
              <MenuItem value="User Management">User Management</MenuItem>
              <MenuItem value="Settings">Settings</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
