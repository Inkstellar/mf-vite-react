import React from 'react';
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Stack,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Save as SaveIcon,
    PhotoCamera as PhotoCameraIcon,
    Language as LanguageIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { GeneralSettingsProps } from './types';

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    settings,
    onChange,
    onSave
}) => {
    return (
        <>
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '2 1 0%' } }}>
                    <Typography variant="h6" gutterBottom>
                        Profile Information
                    </Typography>

                    <Stack spacing={3}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{ width: 80, height: 80 }}
                                src={settings.profilePicture}
                            >
                                {settings.firstName[0]}{settings.lastName[0]}
                            </Avatar>
                            <Box>
                                <Tooltip title="Change profile picture">
                                    <IconButton color="primary" component="label">
                                        <input hidden accept="image/*" type="file" />
                                        <PhotoCameraIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            label="First Name"
                            value={settings.firstName}
                            onChange={(e) => onChange('firstName', e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="Last Name"
                            value={settings.lastName}
                            onChange={(e) => onChange('lastName', e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={settings.email}
                            onChange={(e) => onChange('email', e.target.value)}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Language</InputLabel>
                            <Select
                                value={settings.language}
                                label="Language"
                                onChange={(e) => onChange('language', e.target.value)}
                                startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Spanish</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                                <MenuItem value="de">German</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Timezone</InputLabel>
                            <Select
                                value={settings.timezone}
                                label="Timezone"
                                onChange={(e) => onChange('timezone', e.target.value)}
                                startAdornment={<AccessTimeIcon sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="UTC">UTC</MenuItem>
                                <MenuItem value="EST">Eastern Time</MenuItem>
                                <MenuItem value="PST">Pacific Time</MenuItem>
                                <MenuItem value="GMT">GMT</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                </Box>

                <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '1 1 0%' } }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Account Status
                            </Typography>
                            <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Account Type:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        Premium
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Member Since:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        Jan 2023
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Last Login:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        Today
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
                
            </Stack >
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

export default GeneralSettings;
