import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
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
  Stack
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon
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
}

interface ClaimItem {
  id: number;
  name: string;
  description: string;
  usageCount: number;
  category: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Edit dialog state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    isActive: true,
    claims: []
  });

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
      const response = await fetch('http://localhost:3001/users');
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
      claims: user.claims || []
    });
    setOpenDialog(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`http://localhost:3001/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: 'Error updating user',
        severity: 'error'
      });
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      isActive: true,
      claims: []
    });
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
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            {getInitials(params.row.firstName, params.row.lastName)}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
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
      valueFormatter: (params: { value: any }) => formatDate(params.value as string)
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Tooltip title={params.value ? 'Active' : 'Inactive'}>
          {params.value ? (
            <ActiveIcon sx={{ color: 'success.main' }} />
          ) : (
            <InactiveIcon sx={{ color: 'error.main' }} />
          )}
        </Tooltip>
      )
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 180,
      valueFormatter: (params: { value: string | undefined }) => params.value === 'Never' ? 'Never' : formatDate(params.value || '')
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

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Loading Users...
          </Typography>
          <LinearProgress />
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchUsers}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Users Management</h1>
        <p>Manage user accounts and permissions</p>
      </div>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>

      {/* Summary Cards */}
      <Box mt={4} display="flex" gap={2} flexWrap="wrap">
        <Paper sx={{ p: 3, minWidth: 200 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Total Users
          </Typography>
          <Typography variant="h3">
            {users.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, minWidth: 200 }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            Active Users
          </Typography>
          <Typography variant="h3">
            {users.filter(user => user.isActive).length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, minWidth: 200 }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            Inactive Users
          </Typography>
          <Typography variant="h3">
            {users.filter(user => !user.isActive).length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, minWidth: 200 }}>
          <Typography variant="h6" color="info.main" gutterBottom>
            Roles
          </Typography>
          <Typography variant="h3">
            {new Set(users.map(user => user.role)).size}
          </Typography>
        </Paper>
      </Box>

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
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Users;
