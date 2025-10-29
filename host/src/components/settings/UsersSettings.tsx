import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Autocomplete,
  Stack,
  Card,
  CardMedia,
  CardContent as MuiCardContent
} from '@mui/material';
import { authService } from '../../services/auth';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  lastLogin?: string;
  claims?: string[];
  profilePicture?: string;
}

interface ClaimItem {
  id: number;
  name: string;
  description: string;
  usageCount: number;
  category: string;
  createdAt: string;
}

interface UsersSettingsProps {
  onSave?: () => void;
}

const UsersSettings: React.FC<UsersSettingsProps> = ({ onSave }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Check authentication status
  const token = authService.getToken();
  const isAuthenticated = token && authService.isTokenValid();

  // If not authenticated, don't render the component
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Authentication Required
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Please log in to access user management features.
        </Typography>
      </Box>
    );
  }

  // Edit dialog state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    isActive: true,
    claims: [],
    profilePicture: ''
  });

  // Profile picture state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // Fetch users and claims from JSON server
  useEffect(() => {
    fetchUsers();
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await fetch('http://localhost:3001/claims');
      if (response.ok) {
        const data = await response.json();
        setClaims(data);
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch('http://localhost:3001/users', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setSnackbar({ open: true, message: 'Error loading users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get role color
  const getRoleColor = (role: string) => {
    if (!role) return 'default';
    
    switch (role.toLowerCase()) {
      case 'developer':
        return 'primary';
      case 'designer':
        return 'secondary';
      case 'manager':
        return 'warning';
      case 'analyst':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Handle form input changes
  const handleInputChange = (field: keyof User) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle claims selection
  const handleClaimsChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      claims: newValue
    }));
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      claims: user.claims || [],
      profilePicture: user.profilePicture || ''
    });
    // Clear any existing preview when opening dialog
    setPreviewUrl('');
    setSelectedFile(null);
    setUploading(false);
    setOpenDialog(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!editingUser) return;

    try {
      const token = authService.getToken();
      const response = await fetch(`http://localhost:3001/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          createdAt: editingUser.createdAt,
          lastLogin: editingUser.lastLogin
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
        handleCloseDialog();
      } else {
        throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error updating user',
        severity: 'error'
      });
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      isActive: true,
      claims: [],
      profilePicture: ''
    });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSnackbar({ open: true, message: 'Please select a valid image file', severity: 'error' });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File size must be less than 5MB', severity: 'error' });
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !editingUser) return;

    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      // Upload file to server
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Update form data with the file path
      setFormData(prev => ({ ...prev, profilePicture: result.filePath }));
      setPreviewUrl('');
      setSelectedFile(null);
      setUploading(false);
      setSnackbar({ open: true, message: 'Profile picture uploaded successfully', severity: 'success' });
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
      setSnackbar({ open: true, message: 'Error uploading profile picture', severity: 'error' });
    }
  };

  // Helper function to get full image URL
  const getFullImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:3001${imageUrl}`;
  };

  // Handle remove preview
  const handleRemovePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null);
    // Reset file input
    const input = document.getElementById('profile-picture-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  // Handle remove current picture
  const handleRemoveCurrentPicture = () => {
    setFormData(prev => ({ ...prev, profilePicture: '' }));
    setSnackbar({ open: true, message: 'Profile picture removed', severity: 'success' });
  };

  // Get claim color
  const getClaimColor = (claimName: string) => {
    const claim = claims.find(c => c.name === claimName);
    if (!claim) return 'default';

    switch (claim.category) {
      case 'admin': return 'error';
      case 'feature': return 'primary';
      case 'basic': return 'success';
      default: return 'default';
    }
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={getFullImageUrl(params?.row?.profilePicture)}
            sx={{
              bgcolor: params?.row?.profilePicture ? 'transparent' : 'primary.main',
              width: 32,
              height: 32
            }}
          >
            {!params?.row?.profilePicture && params?.row?.firstName && params?.row?.lastName && getInitials(params.row.firstName, params.row.lastName)}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params?.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Box display="flex" alignItems="center" gap={1}>
          <EmailIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Chip
          label={params.value}
          color={getRoleColor(params.value)}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'claims',
      headerName: 'Claims',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {params.value && params.value.length > 0 ? (
            params.value.slice(0, 2).map((claimName: string) => (
              <Chip
                key={claimName}
                label={claimName}
                color={getClaimColor(claimName)}
                size="small"
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No claims
            </Typography>
          )}
          {params.value && params.value.length > 2 && (
            <Chip
              label={`+${params.value.length - 2}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 180,
      valueFormatter: (params: { value: any }) => params?.value ? formatDate(params.value as string) : ''
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 180,
      valueFormatter: (params: { value: string | undefined }) => params?.value === 'Never' ? 'Never' : params?.value ? formatDate(params.value) : 'Never'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Tooltip title="Edit User">
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  // Transform users to rows
  const rows = users.map(user => ({
    ...user,
    name: `${user.firstName} ${user.lastName}`,
    claims: user.claims || [],
    lastLogin: user.lastLogin || 'Never'
  }));

  return (
    <>
      <Typography variant="h6" gutterBottom>
        User Management
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Total Users
          </Typography>
          <Typography variant="h4">
            {users.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            Active Users
          </Typography>
          <Typography variant="h4">
            {users.filter(user => user.isActive).length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            Inactive Users
          </Typography>
          <Typography variant="h4">
            {users.filter(user => !user.isActive).length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="info.main" gutterBottom>
            Roles
          </Typography>
          <Typography variant="h4">
            {new Set(users.map(user => user.role)).size}
          </Typography>
        </Paper>
      </Box>

      {/* Users DataGrid */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          loading={loading}
          localeText={{
            noRowsLabel: 'No users found.'
          }}
        />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName || ''}
                onChange={handleInputChange('firstName')}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName || ''}
                onChange={handleInputChange('lastName')}
                required
              />
            </Stack>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange('email')}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role || ''}
                onChange={handleInputChange('role')}
                label="Role"
              >
                <MenuItem value="developer">Developer</MenuItem>
                <MenuItem value="designer">Designer</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="analyst">Analyst</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
              }
              label="Active User"
            />

            <Autocomplete
              multiple
              options={claims.map(claim => claim.name)}
              value={formData.claims || []}
              onChange={handleClaimsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Claims"
                  placeholder="Select claims..."
                  helperText="Choose the permissions this user should have"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    color={getClaimColor(option)}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderOption={(props, option) => {
                const claim = claims.find(c => c.name === option);
                return (
                  <Box component="li" {...props}>
                    <Stack>
                      <Typography variant="body2" fontWeight="medium">
                        {option}
                      </Typography>
                      {claim && (
                        <Typography variant="caption" color="text.secondary">
                          {claim.description} ({claim.category})
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                );
              }}
            />

            {/* Profile Picture Section */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Profile Picture
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                {/* Current Profile Picture Display */}
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={formData.profilePicture || editingUser?.profilePicture ? getFullImageUrl(formData.profilePicture || editingUser?.profilePicture) : ''}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '1.5rem'
                    }}
                  >
                    {(!formData.profilePicture && !editingUser?.profilePicture) &&
                      getInitials(formData.firstName || '', formData.lastName || '')
                    }
                  </Avatar>
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    Current
                  </Typography>
                </Box>

                {/* Upload Section */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => document.getElementById('profile-picture-input')?.click()}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body1" gutterBottom>
                      Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PNG, JPG, GIF up to 5MB
                    </Typography>
                  </Box>

                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />

                  {/* Preview */}
                  {previewUrl && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body2" gutterBottom>
                        Preview:
                      </Typography>
                      <Avatar
                        src={previewUrl}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          border: '2px solid',
                          borderColor: 'primary.main'
                        }}
                      />
                    </Box>
                  )}

                  {/* Upload Progress */}
                  {uploading && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="primary" gutterBottom>
                        Uploading...
                      </Typography>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {previewUrl && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        Upload
                      </Button>
                    )}
                    {previewUrl && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={handleRemovePreview}
                      >
                        Remove
                      </Button>
                    )}
                    {(formData.profilePicture || editingUser?.profilePicture) && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveCurrentPicture}
                      >
                        Remove Current
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {editingUser && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Created:</strong> {formatDate(editingUser.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Last Login:</strong> {editingUser.lastLogin ? formatDate(editingUser.lastLogin) : 'Never'}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.role}
          >
            Update User
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
    </>
  );
};

export default UsersSettings;
