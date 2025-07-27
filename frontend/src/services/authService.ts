import { api } from './api';
import type { LoginCredentials, SignupCredentials, User } from '@/types/auth';

interface ApiUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Convert API user format to frontend user format
const convertApiUser = (apiUser: ApiUser): User => ({
  id: String(apiUser.id),
  name: apiUser.name,
  email: apiUser.email,
  createdAt: apiUser.created_at,
  updatedAt: apiUser.updated_at,
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<ApiUser>>('/api/auth/login', credentials);
      return convertApiUser(response.data);
    } catch {
      throw new Error('Login failed');
    }
  },

  signup: async (credentials: SignupCredentials): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<ApiUser>>('/api/auth/signup', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      });
      return convertApiUser(response.data);
    } catch {
      throw new Error('Signup failed');
    }
  },
}; 