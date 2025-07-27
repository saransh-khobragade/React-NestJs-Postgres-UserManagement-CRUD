import type {
  ApiResponse,
  CreateUserRequest,
  PaginatedResponse,
  UpdateUserRequest,
  User,
} from '../types/index.js';
import type { Request, Response } from 'express';
import { UserService } from '../services/userService.js';

export const createUser = (req: Request, res: Response): void => {
  try {
    const userData = req.body as CreateUserRequest;

    // Basic validation
    if (!userData.name || !userData.email) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Name and email are required',
      };
      res.status(400).json(response);
      return;
    }

    const user = UserService.createUser(userData);
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: 'User created successfully',
    };

    res.status(201).json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to create user',
    };
    res.status(500).json(response);
  }
};

export const getUserById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User ID is required',
      };
      res.status(400).json(response);
      return;
    }

    const user = UserService.getUserById(parseInt(id, 10));

    if (user === null) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    res.status(200).json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to get user',
    };
    res.status(500).json(response);
  }
};

export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const page = parseInt(req.query['page'] as string, 10) || 1;
    const limit = parseInt(req.query['limit'] as string, 10) || 10;

    const result = UserService.getAllUsers(page, limit);

    const response: PaginatedResponse<User> = {
      success: true,
      data: [...result.users],
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };

    res.status(200).json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to get users',
    };
    res.status(500).json(response);
  }
};

export const updateUser = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User ID is required',
      };
      res.status(400).json(response);
      return;
    }

    const updateData = req.body as UpdateUserRequest;

    const user = UserService.updateUser(parseInt(id, 10), updateData);

    if (user === null) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: 'User updated successfully',
    };

    res.status(200).json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to update user',
    };
    res.status(500).json(response);
  }
};

export const deleteUser = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User ID is required',
      };
      res.status(400).json(response);
      return;
    }

    const deleted = UserService.deleteUser(parseInt(id, 10));

    if (!deleted) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<never> = {
      success: true,
      message: 'User deleted successfully',
    };

    res.status(200).json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to delete user',
    };
    res.status(500).json(response);
  }
};
