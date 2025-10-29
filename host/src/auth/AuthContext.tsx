import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData, authService } from '../services/auth';

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

// Auth Context
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  activateAccount: (token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();

      if (token && authService.isTokenValid()) {
        try {
          // First try to get user data from token directly (for localStorage tokens)
          const userFromToken = authService.getUserFromToken();
          if (userFromToken) {
            authService.setUser(userFromToken);
            dispatch({ type: 'AUTH_SUCCESS', payload: { user: userFromToken, token } });
            return;
          }

          // If token parsing fails, try server verification as fallback
          const response = await authService.verifyToken();

          if (response.valid && response.user) {
            authService.setUser(response.user);
            dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, token } });
          } else {
            // Token is invalid, logout
            authService.logout();
          }
        } catch (error) {
          // If server verification fails, try to use token data directly
          const userFromToken = authService.getUserFromToken();
          if (userFromToken) {
            authService.setUser(userFromToken);
            dispatch({ type: 'AUTH_SUCCESS', payload: { user: userFromToken, token } });
          } else {
            // Both token parsing and server verification failed, logout
            authService.logout();
          }
        }
      } else if (token) {
        // Token exists but is invalid, logout
        authService.logout();
      }
    };

    initAuth();
  }, []);

  // Add a method to refresh user data
  const refreshUser = async (): Promise<void> => {
    const token = authService.getToken();
    if (token && authService.isTokenValid()) {
      try {
        const response = await authService.verifyToken();
        if (response.valid && response.user) {
          const userFromToken = authService.getUserFromToken();
          if (userFromToken) {
            authService.setUser(userFromToken);
            dispatch({ type: 'AUTH_SUCCESS', payload: { user: userFromToken, token } });
          }
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  // Auth methods
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user, token } = await authService.login(credentials);

      authService.setToken(token);
      authService.setUser(user);

      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await authService.register(userData);
      // Registration successful, but user needs to activate account
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.forgotPassword(data);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Failed to send reset email' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.resetPassword(data);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Failed to reset password' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const activateAccount = async (token: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.activateAccount(token);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Failed to activate account' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    activateAccount,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
