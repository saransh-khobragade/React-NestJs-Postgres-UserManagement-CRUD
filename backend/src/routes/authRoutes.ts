import type { Request, Response } from 'express';
import { userOperations } from '../services/database.js';
import logger from '../services/logger.js';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// Simple authentication (in production, use proper password hashing and JWT)
const authenticateUser = async (email: string, password: string): Promise<unknown> => {
  // For demo purposes, we'll use a simple check
  // In production, you should hash passwords and use proper authentication
  const user = await userOperations.getUserByEmail(email);

  if (!user) {
    return null;
  }

  // Simple password check (replace with proper hashing in production)
  // For now, we'll just check if the password is not empty
  if (!password || password.length < 1) {
    return null;
  }

  return user;
};

// Login endpoint
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // In production, generate JWT token here
    res.json({
      success: true,
      data: user,
      message: 'Login successful',
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      details: String(error),
    });
  }
};

// Signup endpoint
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as SignupRequest;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'Name, email, and password are required',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await userOperations.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
      return;
    }

    // In production, hash the password before storing
    // For now, we'll just create the user (password not stored in current schema)
    const newUser = await userOperations.createUser(name, email);

    // In production, generate JWT token here
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Signup failed',
      details: String(error),
    });
  }
};
