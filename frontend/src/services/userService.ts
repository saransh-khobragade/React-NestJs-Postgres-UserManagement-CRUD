import { api } from './api';
import type { User, CreateUserData, UpdateUserData } from '@/types/user';

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
  source?: string;
}

// Convert API user format to frontend user format
const convertApiUser = (apiUser: ApiUser): User => ({
  id: String(apiUser.id),
  name: apiUser.name,
  email: apiUser.email,
  createdAt: apiUser.created_at,
  updatedAt: apiUser.updated_at,
});

const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<ApiResponse<ApiUser[]>>('/api/users');
    return response.data.map(convertApiUser);
  } catch {
    throw new Error('Failed to fetch users');
  }
};

const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const response = await api.post<ApiResponse<ApiUser>>('/api/users', userData);
    return convertApiUser(response.data);
  } catch {
    throw new Error('Failed to create user');
  }
};

const updateUser = async (
  id: string,
  userData: UpdateUserData,
): Promise<User> => {
  try {
    const response = await api.put<ApiResponse<ApiUser>>(`/api/users/${id}`, userData);
    return convertApiUser(response.data);
  } catch {
    throw new Error('Failed to update user');
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete<ApiResponse<ApiUser>>(`/api/users/${id}`);
  } catch {
    throw new Error('Failed to delete user');
  }
};

export const userService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
