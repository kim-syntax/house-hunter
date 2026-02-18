/**
 * Authentication API Service
 */

import { apiClient, handleApiCall } from '../api/client';
import type {
  User,
  AuthResponse,
  LoginCredentials,
  SignupData,
} from '../types';

export const authService = {
  /**
   * Tenant signup
   */
  signupTenant: (data: Omit<SignupData, 'role'>) =>
    handleApiCall<AuthResponse>(
      apiClient.post('/auth/signup/tenant', { ...data, role: 'tenant' })
    ),

  /**
   * Landlord signup
   */
  signupLandlord: (data: Omit<SignupData, 'role'>) =>
    handleApiCall<AuthResponse>(
      apiClient.post('/auth/signup/landlord', { ...data, role: 'landlord' })
    ),

  /**
   * Login
   */
  login: (credentials: LoginCredentials) =>
    handleApiCall<AuthResponse>(
      apiClient.post('/auth/login', credentials)
    ),

  /**
   * Refresh token
   */
  refreshToken: (refreshToken: string) =>
    handleApiCall<AuthResponse>(
      apiClient.post('/auth/refresh', { refreshToken })
    ),

  /**
   * Get current user
   */
  getCurrentUser: () =>
    handleApiCall<User>(
      apiClient.get('/auth/me')
    ),

  /**
   * Logout
   */
  logout: () =>
    apiClient.post('/auth/logout'),

  /**
   * Request password reset
   */
  requestPasswordReset: (email: string) =>
    apiClient.post('/auth/password-reset/request', { email }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/password-reset/confirm', { token, newPassword }),

  /**
   * Verify email
   */
  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),

  /**
   * Resend verification email
   */
  resendVerificationEmail: (email: string) =>
    apiClient.post('/auth/resend-verification', { email }),
};
