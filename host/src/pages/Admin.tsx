import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Autocomplete,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Star as StarIcon,
  Folder as FolderIcon,
  Person as PersonIcon,
  Settings as SettingsIcon} from '@mui/icons-material';
import { NavigationItem, IconItem, ClaimItem } from './Admin.types';

const Admin: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [formData, setFormData] = useState<NavigationItem>({
    path: '',
    label: '',
    icon: '',
    section: '',
    claims: []
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch navigation items, icons, and claims from JSON server
  useEffect(() => {
    fetchNavItems();
    fetchIcons();
    fetchClaims();
  }, []);

  const fetchIcons = async () => {
    try {
      const response = await fetch('http://localhost:3001/icons');
      const data = await response.json();
      setIcons(data);
    } catch (error) {
      console.error('Error fetching icons:', error);
      setSnackbar({ open: true, message: 'Error fetching icons', severity: 'error' });
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await fetch('http://localhost:3001/claims');
      const data = await response.json();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      setSnackbar({ open: true, message: 'Error fetching claims', severity: 'error' });
    }
  };

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

  // Sync new claims with the claims API
  const syncClaimsWithAPI = async (claimsToSync: string[]) => {
    const existingClaimNames = claims.map(c => c.name);
    const newClaims = claimsToSync.filter(claim => !existingClaimNames.includes(claim));

    for (const newClaim of newClaims) {
      try {
        await fetch('http://localhost:3001/claims', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newClaim,
            description: `User-defined claim: ${newClaim}`,
            usageCount: 1,
            category: 'custom',
            createdAt: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Error syncing claim:', error);
      }
    }

    // Update usage count for existing claims
    const updatedClaims = claimsToSync.filter(claim => existingClaimNames.includes(claim));
    for (const claimName of updatedClaims) {
      const claim = claims.find(c => c.name === claimName);
      if (claim) {
        try {
          await fetch(`http://localhost:3001/claims/${claim.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              usageCount: claim.usageCount + 1,
            }),
          });
        } catch (error) {
          console.error('Error updating claim usage:', error);
        }
      }
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async () => {
    try {
      // Sync claims with API before submitting
      if (formData.claims && formData.claims.length > 0) {
        await syncClaimsWithAPI(formData.claims);
      }

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
          await fetchClaims(); // Refresh claims to get updated usage counts
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
          await fetchClaims(); // Refresh claims to get updated usage counts
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
    setFormData({
      ...item,
      claims: item.claims || []
    });
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
      section: '',
      claims: []
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
      section: '',
      claims: []
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };



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
                            <Stack direction={"row"} spacing={2}>
                          <Box
                                component="div"
                                sx={{
                                  mt: 1,
                                  p: 1,
                                  bgcolor: 'grey.50',
                                  borderRadius: 1,
                                  width: 40,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                dangerouslySetInnerHTML={{ __html: item.icon }}
                              />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {item.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.path}
                              </Typography>
                            </Box>
                            </Stack>
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
                              
                              {item.claims && item.claims.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" display="block">
                                    <strong>Claims:</strong>
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {item.claims.map((claim, index) => (
                                      <Chip
                                        key={index}
                                        label={claim}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
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
                options={icons}
                getOptionLabel={(option) => option.name}
                value={icons.find(icon => icon.svg === formData.icon) || null}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    icon: newValue?.svg || ''
                  }));
                }}
                renderOption={(props, option) => (
                  <ListItem {...props}>
                    <Tooltip title={option.name}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          component="div"
                          sx={{
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          dangerouslySetInnerHTML={{ __html: option.svg }}
                        />
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText
                      primary={option.name}
                      secondary={option.category}
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
                groupBy={(option) => typeof option === 'string' ? 'New Claims' : option.category}
                loading={icons.length === 0}
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

              <Autocomplete
                multiple
                fullWidth
                options={claims}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                value={formData.claims?.map(claim => claims.find(c => c.name === claim) || claim).filter(Boolean) || []}
                onChange={(event, newValue) => {
                  const claimNames = newValue.map(item =>
                    typeof item === 'string' ? item : item.name
                  );
                  setFormData(prev => ({ ...prev, claims: claimNames }));
                }}
                renderOption={(props, option) => (
                  <ListItem {...props}>
                    <ListItemText
                      primary={typeof option === 'string' ? option : option.name}
                      secondary={typeof option === 'string' ? '' : `${option.description} (used ${option.usageCount} times)`}
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Claims"
                    placeholder="Select or type claims..."
                    margin="normal"
                    helperText="Select from existing claims or type new ones"
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={typeof option === 'string' ? option : option.name}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
                freeSolo
                groupBy={(option) => typeof option === 'string' ? 'New Claims' : option.category}
                loading={claims.length === 0}
              />

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
