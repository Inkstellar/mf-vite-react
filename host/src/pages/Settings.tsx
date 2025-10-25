import React, { useState } from 'react';
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
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    language: 'en',
    timezone: 'UTC',
    profilePicture: ''
  });

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

  const handleSaveSettings = (section: string) => {
    // Simulate API call
    setSnackbar({
      open: true,
      message: `${section} settings saved successfully!`,
      severity: 'success'
    });
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
