// Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Storage Keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  REMEMBER_ME: 'remember_me',
};

// API Base URL
const API_BASE_URL = 'http://localhost:3001';

// Auth Service Class
class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Storage methods
  setStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getStorageItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeStorageItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearStorage(): void {
    this.removeStorageItem(STORAGE_KEYS.TOKEN);
    this.removeStorageItem(STORAGE_KEYS.USER);
    this.removeStorageItem(STORAGE_KEYS.REMEMBER_ME);
  }

  // Token management
  setToken(token: string): void {
    this.setStorageItem(STORAGE_KEYS.TOKEN, token);
  }

  getToken(): string | null {
    return this.getStorageItem(STORAGE_KEYS.TOKEN);
  }

  removeToken(): void {
    this.removeStorageItem(STORAGE_KEYS.TOKEN);
  }

  // User management
  setUser(user: User): void {
    this.setStorageItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = this.getStorageItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  removeUser(): void {
    this.removeStorageItem(STORAGE_KEYS.USER);
  }

  // API calls
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // For demo purposes, we'll simulate login with json-server users
    const users = await this.apiCall('/users');
    const user = users.find((u: User) => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const token = `demo_token_${user.id}_${Date.now()}`;
    return { user, token };
  }

  async register(userData: RegisterData): Promise<User> {
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const newUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: 'user',
      isActive: false,
      createdAt: new Date().toISOString(),
    };

    const createdUser = await this.apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    return createdUser;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Password reset email sent to: ${data.email}`);
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset successful');
  }

  async activateAccount(token: string): Promise<User> {
    // Simulate account activation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Account activated with token: ${token}`);
    return {} as User;
  }

  logout(): void {
    this.clearStorage();
  }

  // Session management
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Simple expiration check (demo purposes)
      const parts = token.split('_');
      if (parts.length >= 3) {
        const timestamp = parseInt(parts[2]);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours
        return (now - timestamp) > oneDay;
      }
      return true;
    } catch {
      return true;
    }
  }

  refreshSession(): boolean {
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }
}

// Create auth service instance
const authService = AuthService.getInstance();

// Export auth service instance for direct use if needed
export { authService };
