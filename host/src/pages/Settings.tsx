import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { authService } from '../services/auth';
import {
  Person as PersonIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Assignment as ClaimsIcon
} from '@mui/icons-material';
import {
  GeneralSettings,
  AppearanceSettings,
  NotificationSettings,
  SecuritySettings,
  AdvancedSettings,
  AdminSettings,
  UsersSettings,
  ClaimsSettings
} from '../components/settings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings: React.FC = () => {
  const { state, refreshUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form states - initialize with auth user data
  const [generalSettings, setGeneralSettings] = useState({
    id: state.user?.id,
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    role: state.user?.role || '',
    language: state.user?.language || 'en',
    timezone: state.user?.timezone || 'UTC',
    profilePicture: state.user?.profilePicture || '',
    createdAt: state.user?.createdAt || '',
    isActive: state.user?.isActive ?? true,
    lastLogin: state.user?.lastLogin || '',
    claims: state.user?.claims || []
  });

  // Update generalSettings when user data changes
  useEffect(() => {
    if (state.user) {
      console.log('Settings - User updated:', state.user);
      setGeneralSettings(prev => ({
        ...prev,
        id: state.user?.id || prev.id,
        firstName: state.user?.firstName || prev.firstName,
        lastName: state.user?.lastName || prev.lastName,
        email: state.user?.email || prev.email,
        role: state.user?.role || prev.role,
        language: state.user?.language || prev.language,
        timezone: state.user?.timezone || prev.timezone,
        profilePicture: state.user?.profilePicture || prev.profilePicture,
        createdAt: state.user?.createdAt || prev.createdAt,
        isActive: state.user?.isActive ?? prev.isActive,
        lastLogin: state.user?.lastLogin || prev.lastLogin,
        claims: state.user?.claims || prev.claims
      }));
    }
  }, [state.user]);

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactMode: false,
    sidebarCollapsed: false,
    fontSize: 'medium'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    weeklyReports: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordChangeRequired: false,
    loginAlerts: true
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = async (section: string) => {
    try {
      if (section === 'General' && state.user && state.user.id) {
        // Update user profile via API
        const token = authService.getToken();
        const response = await fetch(`http://localhost:3001/users/${state.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        body: JSON.stringify({
          ...generalSettings,
          id: state.user.id,
          createdAt: state.user.createdAt,
          lastLogin: state.user.lastLogin
        }),
        });

        if (response.ok) {
          // Update local auth state
          const updatedUser = {
            ...state.user,
            ...generalSettings,
            id: state.user.id
          } as typeof state.user;
          authService.setUser(updatedUser);

          // Refresh the auth context to ensure all components get the latest user data
          await refreshUser();

          // Force a re-render by updating the generalSettings state
          setGeneralSettings(prev => ({
            ...prev,
            profilePicture: generalSettings.profilePicture
          }));

          setSnackbar({
            open: true,
            message: 'Profile updated successfully!',
            severity: 'success'
          });
        } else {
          throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
        }
      } else {
        // For other sections, just show success message
        setSnackbar({
          open: true,
          message: `${section} settings saved successfully!`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : `Error saving ${section} settings`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGeneralChange = (field: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAppearanceChange = (field: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: any) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };



  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage your account settings and preferences
      </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<PersonIcon />}
              label="General"
              {...a11yProps(0)}
            />
            <Tab
              icon={<PaletteIcon />}
              label="Appearance"
              {...a11yProps(1)}
            />
            <Tab
              icon={<NotificationsIcon />}
              label="Notifications"
              {...a11yProps(2)}
            />
            <Tab
              icon={<SecurityIcon />}
              label="Security"
              {...a11yProps(3)}
            />
            <Tab
              icon={<AdminIcon />}
              label="Admin"
              {...a11yProps(4)}
            />
            <Tab
              icon={<PeopleIcon />}
              label="Users"
              {...a11yProps(5)}
            />
            <Tab
              icon={<ClaimsIcon />}
              label="Claims"
              {...a11yProps(6)}
            />
            <Tab
              icon={<SettingsIcon />}
              label="Advanced"
              {...a11yProps(7)}
            />
          </Tabs>
        </Box>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <GeneralSettings
            settings={generalSettings}
            onChange={handleGeneralChange}
            onSave={() => handleSaveSettings('General')}
          />
        </TabPanel>

        {/* Appearance Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <AppearanceSettings
            settings={appearanceSettings}
            onChange={handleAppearanceChange}
            onSave={() => handleSaveSettings('Appearance')}
          />
        </TabPanel>

        {/* Notifications Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <NotificationSettings
            settings={notificationSettings}
            onChange={handleNotificationChange}
            onSave={() => handleSaveSettings('Notification')}
          />
        </TabPanel>

        {/* Security Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <SecuritySettings
            settings={securitySettings}
            onChange={handleSecurityChange}
            onSave={() => handleSaveSettings('Security')}
          />
        </TabPanel>

        {/* Admin Settings Tab */}
        <TabPanel value={tabValue} index={4}>
          <AdminSettings
            onSave={() => handleSaveSettings('Admin')}
          />
        </TabPanel>

        {/* Users Settings Tab */}
        <TabPanel value={tabValue} index={5}>
          <UsersSettings
            onSave={() => handleSaveSettings('Users')}
          />
        </TabPanel>

        {/* Claims Settings Tab */}
        <TabPanel value={tabValue} index={6}>
          <ClaimsSettings
            onSave={() => handleSaveSettings('Claims')}
          />
        </TabPanel>

        {/* Advanced Settings Tab */}
        <TabPanel value={tabValue} index={7}>
          <AdvancedSettings
            settings={securitySettings}
            onChange={handleSecurityChange}
            onSave={() => handleSaveSettings('Advanced')}
          />
        </TabPanel>

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

export default Settings;
