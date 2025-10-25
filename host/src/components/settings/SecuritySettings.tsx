import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { SecuritySettingsProps } from './types';

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  settings,
  onChange,
  onSave
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>

      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon fontSize="small" />
            Account Security
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => onChange('twoFactorEnabled', e.target.checked)}
                />
              }
              label="Two-factor authentication"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.loginAlerts}
                  onChange={(e) => onChange('loginAlerts', e.target.checked)}
                />
              }
              label="Login alerts"
            />

            <FormControl fullWidth>
              <InputLabel>Session Timeout (minutes)</InputLabel>
              <Select
                value={settings.sessionTimeout}
                label="Session Timeout (minutes)"
                onChange={(e) => onChange('sessionTimeout', e.target.value)}
              >
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={240}>4 hours</MenuItem>
                <MenuItem value={0}>Never</MenuItem>
              </Select>
            </FormControl>

            <Button variant="outlined" color="primary">
              Change Password
            </Button>

            <Button variant="outlined" color="secondary">
              Download Account Data
            </Button>
          </Stack>
        </Box>

        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Sessions
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Current Session
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chrome on Windows • Active now
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Mobile App
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    iOS App • 2 hours ago
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" color="error">
                  Revoke All Sessions
                </Button>
              </Stack>
            </CardContent>
          </Card>
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

export default SecuritySettings;
