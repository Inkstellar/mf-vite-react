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
  claims?: string[];
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

// API Base URL - using proxy in development
const API_BASE_URL = '/api';

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
    const response = await this.apiCall('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return response;
  }

  async register(userData: RegisterData): Promise<User> {
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const response = await this.apiCall('/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      }),
    });

    return response.user;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await this.apiCall('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await this.apiCall('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async activateAccount(token: string): Promise<User> {
    const response = await this.apiCall('/activate', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    return response.user;
  }

  // JWT Token validation
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic check if token exists and is not expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Get user info from JWT token
  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role,
        isActive: payload.isActive,
        createdAt: '',
        lastLogin: '',
        claims: payload.claims || []
      };
    } catch {
      return null;
    }
  }

  // Verify token with server
  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await this.apiCall('/verify-token');
      return response;
    } catch (error) {
      return { valid: false };
    }
  }

  logout(): void {
    this.clearStorage();
  }

  // Session management
  isTokenExpired(): boolean {
    return !this.isTokenValid();
  }

  refreshSession(): boolean {
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }

  // Check if user has specific claim/permission
  hasClaim(claim: string): boolean {
    const user = this.getUserFromToken();
    return user?.claims?.includes(claim) || false;
  }

  // Check if user has any of the specified claims
  hasAnyClaim(claims: string[]): boolean {
    const user = this.getUserFromToken();
    return claims.some(claim => user?.claims?.includes(claim));
  }

  // Check if user has all of the specified claims
  hasAllClaims(claims: string[]): boolean {
    const user = this.getUserFromToken();
    return claims.every(claim => user?.claims?.includes(claim));
  }
}

// Create auth service instance
const authService = AuthService.getInstance();

// Export auth service instance for direct use if needed
export { authService };
