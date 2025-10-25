import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  DataUsage as DataUsageIcon,
  TwoWheeler as TwoWheelerIcon
} from '@mui/icons-material';
import { AdvancedSettingsProps } from './types';

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  settings,
  onChange,
  onSave
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Advanced Settings
      </Typography>

      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DataUsageIcon fontSize="small" />
            Data & Privacy
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordChangeRequired}
                  onChange={(e) => onChange('passwordChangeRequired', e.target.checked)}
                />
              }
              label="Require password change on next login"
            />

            <Button variant="outlined" color="info">
              Export All Data
            </Button>

            <Button variant="outlined" color="warning">
              Clear Cache & Cookies
            </Button>

            <Button variant="outlined" color="error">
              Delete Account
            </Button>
          </Stack>
        </Box>

        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TwoWheelerIcon fontSize="small" />
            Developer Options
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={<Switch />}
              label="Enable debug mode"
            />

            <FormControlLabel
              control={<Switch />}
              label="Show API endpoints"
            />

            <FormControlLabel
              control={<Switch />}
              label="Verbose logging"
            />

            <TextField
              fullWidth
              label="API Base URL"
              defaultValue="https://api.example.com"
              size="small"
            />

            <Button variant="outlined">
              Reset to Defaults
            </Button>
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

export default AdvancedSettings;
