import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon
} from '@mui/icons-material';
import { AppearanceSettingsProps } from './types';

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onChange,
  onSave
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Appearance Preferences
      </Typography>

      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', px:2}}>
        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Theme</InputLabel>
            <Select
              value={settings.theme}
              label="Theme"
              onChange={(e) => onChange('theme', e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="auto">Auto (System)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Font Size</InputLabel>
            <Select
              value={settings.fontSize}
              label="Font Size"
              onChange={(e) => onChange('fontSize', e.target.value)}
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={settings.compactMode}
                onChange={(e) => onChange('compactMode', e.target.checked)}
              />
            }
            label="Compact Mode"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.sidebarCollapsed}
                onChange={(e) => onChange('sidebarCollapsed', e.target.checked)}
              />
            }
            label="Collapsed Sidebar by Default"
          />
        </Box>

        <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: settings.theme === 'dark' ? 'grey.900' : 'background.paper',
                  color: settings.theme === 'dark' ? 'common.white' : 'text.primary'
                }}
              >
                <Typography variant="body1">
                  This is how your interface will look
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                  Sample content with current settings
                </Typography>
              </Box>
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

export default AppearanceSettings;
