import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  Email as EmailIcon,
  Smartphone as SmartphoneIcon
} from '@mui/icons-material';
import { NotificationSettingsProps } from './types';

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onChange,
  onSave
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>

      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon fontSize="small" />
            Email Notifications
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => onChange('emailNotifications', e.target.checked)}
                />
              }
              label="Account activity emails"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.securityAlerts}
                  onChange={(e) => onChange('securityAlerts', e.target.checked)}
                />
              }
              label="Security alerts"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.weeklyReports}
                  onChange={(e) => onChange('weeklyReports', e.target.checked)}
                />
              }
              label="Weekly summary reports"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.marketingEmails}
                  onChange={(e) => onChange('marketingEmails', e.target.checked)}
                />
              }
              label="Marketing and promotional emails"
            />
          </Stack>
        </Box>

        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartphoneIcon fontSize="small" />
            Push Notifications
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(e) => onChange('pushNotifications', e.target.checked)}
                />
              }
              label="Browser push notifications"
            />

            <Alert severity="info">
              Push notifications require browser permission and will only work when the app is open.
            </Alert>
          </Stack>
        </Box>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default NotificationSettings;
