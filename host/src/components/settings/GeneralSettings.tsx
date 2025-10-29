import React, { useState } from 'react';
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
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Save as SaveIcon,
    PhotoCamera as PhotoCameraIcon,
    Language as LanguageIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { GeneralSettingsProps } from './types';
import { authService } from '../../services/auth';

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    settings,
    onChange,
    onSave
}) => {
    // Profile picture state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setSnackbar({ open: true, message: 'Please select a valid image file', severity: 'error' });
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({ open: true, message: 'File size must be less than 5MB', severity: 'error' });
            return;
        }

        setSelectedFile(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('profilePicture', selectedFile);

            // Upload file to server
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();

            // Update form data with the file path
            onChange('profilePicture', result.filePath);
            setPreviewUrl('');
            setSelectedFile(null);
            setUploading(false);
            setSnackbar({ open: true, message: 'Profile picture uploaded successfully', severity: 'success' });
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploading(false);
            setSnackbar({ open: true, message: 'Error uploading profile picture', severity: 'error' });
        }
    };

    // Handle remove preview
    const handleRemovePreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl('');
        setSelectedFile(null);
        // Reset file input
        const input = document.getElementById('profile-picture-input') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    };

    // Handle remove current picture
    const handleRemoveCurrentPicture = () => {
        onChange('profilePicture', '');
        setSnackbar({ open: true, message: 'Profile picture removed', severity: 'success' });
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Get initials for avatar
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    // Helper function to get full image URL with cache busting
    const getFullImageUrl = (imageUrl?: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) return imageUrl;
        // Add cache busting parameter to force reload
        const baseUrl = `http://localhost:3001${imageUrl}`;
        const separator = imageUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}t=${Date.now()}`;
    };

    return (
        <>
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 100%', '@media (min-width: 900px)': { flex: '2 1 0%' } }}>
                    <Typography variant="h6" gutterBottom>
                        Profile Information
                    </Typography>

                    <Stack spacing={3}>
                        {/* Profile Picture Section */}
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Profile Picture
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                                {/* Current Profile Picture Display */}
                                <Box sx={{ textAlign: 'center' }}>
                                    <Avatar
                                        key={settings.profilePicture || 'no-image'}
                                        src={getFullImageUrl(settings.profilePicture)}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            bgcolor: 'primary.main',
                                            fontSize: '1.5rem'
                                        }}
                                    >
                                        {(!settings.profilePicture) &&
                                            getInitials(settings.firstName || '', settings.lastName || '')
                                        }
                                    </Avatar>
                                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                        Current
                                    </Typography>
                                </Box>

                                {/* Upload Section */}
                                <Box sx={{ flex: 1 }}>
                                    <Box
                                        sx={{
                                            border: '2px dashed',
                                            borderColor: 'primary.main',
                                            borderRadius: 2,
                                            p: 3,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                borderColor: 'primary.dark',
                                                bgcolor: 'action.hover'
                                            }
                                        }}
                                        onClick={() => document.getElementById('profile-picture-input')?.click()}
                                    >
                                        <PhotoCameraIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                        <Typography variant="body1" gutterBottom>
                                            Click to upload or drag and drop
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            PNG, JPG, GIF up to 5MB
                                        </Typography>
                                    </Box>

                                    <input
                                        id="profile-picture-input"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileSelect}
                                    />

                                    {/* Preview */}
                                    {previewUrl && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" gutterBottom>
                                                Preview:
                                            </Typography>
                                            <Avatar
                                                src={previewUrl}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    mx: 'auto',
                                                    border: '2px solid',
                                                    borderColor: 'primary.main'
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Upload Progress */}
                                    {uploading && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="primary" gutterBottom>
                                                Uploading...
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Action Buttons */}
                                    <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        {previewUrl && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={handleUpload}
                                                disabled={uploading}
                                            >
                                                Upload
                                            </Button>
                                        )}
                                        {previewUrl && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={handleRemovePreview}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                        {settings.profilePicture && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={handleRemoveCurrentPicture}
                                            >
                                                Remove Current
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
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

export default GeneralSettings;
