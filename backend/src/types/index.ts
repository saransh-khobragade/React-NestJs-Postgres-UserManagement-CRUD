// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// API Response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string;
  source?: 'cache' | 'database';
  services?: {
    database: boolean;
    redis: boolean;
  };
}

// Request interfaces
export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
}

// Database result types
export interface DatabaseResult {
  rows: User[];
  rowCount: number;
}

// Pagination interface
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Cache types
export type CacheValue = string | number | boolean | object | null;
