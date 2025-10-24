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
  Button
} from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  MoreVert as MoreIcon
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
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch users from JSON server
  useEffect(() => {
    fetchUsers();
  }, []);

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

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated users
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell align="center">{user.id}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {getInitials(user.firstName, user.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={user.isActive ? 'Active' : 'Inactive'}>
                    {user.isActive ? (
                      <ActiveIcon sx={{ color: 'success.main' }} />
                    ) : (
                      <InactiveIcon sx={{ color: 'error.main' }} />
                    )}
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="default">
                    <MoreIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
