/**
 * Zustand Store for Authentication
 */

import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  signupTenant: (data: any) => Promise<void>;
  signupLandlord: (data: any) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  refreshTokenAsync: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ token });
  },
  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
    set({ refreshToken: token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isLoading: false,
      });
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signupTenant: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signupTenant(data);
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isLoading: false,
      });
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    } catch (error: any) {
      set({
        error: error.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signupLandlord: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signupLandlord(data);
      set({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isLoading: false,
      });
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    } catch (error: any) {
      set({
        error: error.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        user: null,
        token: null,
      });
      localStorage.removeItem('authToken');
    }
  },

  refreshTokenAsync: async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return;

    try {
      const response = await authService.refreshToken(refreshToken);
      set({ token: response.token });
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      set({
        token: null,
        user: null,
        refreshToken: null,
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },
}));
