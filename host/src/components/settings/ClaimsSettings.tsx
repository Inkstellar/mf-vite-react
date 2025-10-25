import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Stack,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { ClaimItem } from '../../pages/Admin.types';

interface ClaimsSettingsProps {
  onSave?: () => void;
}

const ClaimsSettings: React.FC<ClaimsSettingsProps> = ({ onSave }) => {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ClaimItem | null>(null);
  const [formData, setFormData] = useState<Partial<ClaimItem>>({
    name: '',
    description: '',
    category: 'basic'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<ClaimItem | null>(null);

  // Fetch claims from API
  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/claims');
      if (!response.ok) throw new Error('Failed to fetch claims');
      const data = await response.json();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching claims',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // Filter claims based on search term
  const filteredClaims = claims.filter(claim =>
    claim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (field: keyof ClaimItem) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.description || !formData.category) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        });
        return;
      }

      if (editingItem) {
        // Update existing claim
        const response = await fetch(`http://localhost:3001/claims/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            usageCount: editingItem.usageCount,
            createdAt: editingItem.createdAt
          }),
        });

        if (response.ok) {
          await fetchClaims();
          setSnackbar({
            open: true,
            message: 'Claim updated successfully',
            severity: 'success'
          });
          handleCloseDialog();
        } else {
          throw new Error('Failed to update claim');
        }
      } else {
        // Create new claim
        const response = await fetch('http://localhost:3001/claims', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            usageCount: 0,
            createdAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          await fetchClaims();
          setSnackbar({
            open: true,
            message: 'Claim created successfully',
            severity: 'success'
          });
          handleCloseDialog();
        } else {
          throw new Error('Failed to create claim');
        }
      }
    } catch (error) {
      console.error('Error saving claim:', error);
      setSnackbar({
        open: true,
        message: `Error ${editingItem ? 'updating' : 'creating'} claim`,
        severity: 'error'
      });
    }
  };

  // Handle edit
  const handleEdit = (claim: ClaimItem) => {
    setEditingItem(claim);
    setFormData({
      name: claim.name,
      description: claim.description,
      category: claim.category
    });
    setOpenDialog(true);
  };

  // Handle delete
  const handleDelete = async (claim: ClaimItem) => {
    try {
      const response = await fetch(`http://localhost:3001/claims/${claim.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchClaims();
        setSnackbar({
          open: true,
          message: 'Claim deleted successfully',
          severity: 'success'
        });
        setDeleteConfirm(null);
      } else {
        throw new Error('Failed to delete claim');
      }
    } catch (error) {
      console.error('Error deleting claim:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting claim',
        severity: 'error'
      });
    }
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'basic'
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'basic'
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'admin': return 'error';
      case 'feature': return 'primary';
      case 'basic': return 'success';
      default: return 'default';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Typography variant="body1" fontWeight="medium">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Chip
          label={params.value}
          color={getCategoryColor(params.value)}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'usageCount',
      headerName: 'Usage',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<any>) => (
        <Chip
          label={params.value}
          color={params.value > 0 ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 180,
      valueFormatter: (params: { value: any }) => formatDate(params.value as string)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<any>) => (
        <Box display="flex" gap={1} justifyContent="center">
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => setDeleteConfirm(params.row)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Claims Management
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Total Claims
          </Typography>
          <Typography variant="h4">
            {claims.length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            Basic Claims
          </Typography>
          <Typography variant="h4">
            {claims.filter(c => c.category === 'basic').length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            Feature Claims
          </Typography>
          <Typography variant="h4">
            {claims.filter(c => c.category === 'feature').length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="error.main" gutterBottom>
            Admin Claims
          </Typography>
          <Typography variant="h4">
            {claims.filter(c => c.category === 'admin').length}
          </Typography>
        </Paper>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <TextField
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchClaims}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              Add Claim
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Claims DataGrid */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredClaims}
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
            noRowsLabel: searchTerm ? 'No claims match your search.' : 'No claims found.'
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Claim' : 'Add New Claim'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Claim Name"
              value={formData.name || ''}
              onChange={handleInputChange('name')}
              placeholder="e.g., users.view, admin.access"
              required
              helperText="Unique identifier for the claim"
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={handleInputChange('description')}
              placeholder="Describe what this claim allows"
              multiline
              rows={3}
              required
              helperText="Human-readable description of the claim"
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category || 'basic'}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                label="Category"
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="feature">Feature</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {editingItem && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Usage Count:</strong> {editingItem.usageCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {formatDate(editingItem.createdAt)}
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
            disabled={!formData.name || !formData.description || !formData.category}
          >
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Claim</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the claim "{deleteConfirm?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. Any navigation items using this claim will need to be updated.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            color="error"
            variant="contained"
          >
            Delete
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

export default ClaimsSettings;
