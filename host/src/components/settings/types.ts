// Shared types for Settings components
export interface GeneralSettings {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  language: string;
  timezone: string;
  profilePicture?: string;
  createdAt?: string;
  isActive?: boolean;
  lastLogin?: string;
  claims?: string[];
}

export interface AppearanceSettings {
  theme: string;
  compactMode: boolean;
  sidebarCollapsed: boolean;
  fontSize: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordChangeRequired: boolean;
  loginAlerts: boolean;
}

// Props interfaces for each component
export interface GeneralSettingsProps {
  settings: GeneralSettings;
  onChange: (field: keyof GeneralSettings, value: any) => void;
  onSave: () => void;
}

export interface AppearanceSettingsProps {
  settings: AppearanceSettings;
  onChange: (field: keyof AppearanceSettings, value: any) => void;
  onSave: () => void;
}

export interface NotificationSettingsProps {
  settings: NotificationSettings;
  onChange: (field: keyof NotificationSettings, value: any) => void;
  onSave: () => void;
}

export interface SecuritySettingsProps {
  settings: SecuritySettings;
  onChange: (field: keyof SecuritySettings, value: any) => void;
  onSave: () => void;
}

export interface AdvancedSettingsProps {
  settings: SecuritySettings; // Reusing SecuritySettings for advanced options
  onChange: (field: string, value: any) => void;
  onSave: () => void;
}
