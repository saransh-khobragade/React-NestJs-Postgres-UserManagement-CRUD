import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

// Import services
import {
  testConnection as testDbConnection,
  userOperations,
} from './services/database.js';
import {
  cacheOperations,
  connectRedis,
  testRedisConnection,
} from './services/cache.js';
import logger from './services/logger.js';

// Import routes
import { login, signup } from './routes/authRoutes.js';

(dotenv as { config: () => void }).config();

const app = express();
const PORT = process.env['PORT'] ?? 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next) => {
  (logger as { info: (message: string) => void }).info(
    `${req.method} ${req.path} - ${req.ip ?? 'unknown'}`,
  );
  next();
});

// Initialize database and cache connections
const initializeServices = async (): Promise<void> => {
  try {
    // Test database connection
    await testDbConnection();

    // Connect to Redis
    await connectRedis();
    await testRedisConnection();

    logger.info('✅ All services initialized successfully');
  } catch (error) {
    logger.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
};

// Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/signup', signup);

// Health check

app.get('/health', async (_req: Request, res: Response) => {
  try {
    const dbHealthy = await testDbConnection();
    const redisHealthy = await testRedisConnection();

    res.json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy,
        redis: redisHealthy,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server health check failed',
      error: String(error),
    });
  }
});

// Get all users with caching

app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cacheKey = 'users:all';
    const cachedUsers = await cacheOperations.getJson(cacheKey);

    if (cachedUsers) {
      return res.json({
        success: true,
        data: cachedUsers,
        message: 'Users retrieved from cache',
        source: 'cache',
      });
    }

    // If not in cache, get from database
    const users = await userOperations.getAllUsers();

    // Cache the result for 5 minutes
    await cacheOperations.setJson(cacheKey, users, 300);

    res.json({
      success: true,
      data: users,
      message: 'Users retrieved from database',
      source: 'database',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      details: String(error),
    });
    return;
  }
});

// Get user by ID with caching

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    // Try to get from cache first
    const cacheKey = `user:${String(userId)}`;
    const cachedUser = await cacheOperations.getJson(cacheKey);

    if (cachedUser) {
      return res.json({
        success: true,
        data: cachedUser,
        message: 'User retrieved from cache',
        source: 'cache',
      });
    }

    // If not in cache, get from database
    const user = await userOperations.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Cache the result for 10 minutes
    await cacheOperations.setJson(cacheKey, user, 600);

    res.json({
      success: true,
      data: user,
      message: 'User retrieved from database',
      source: 'database',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
      details: String(error),
    });
    return;
  }
});

// Create user

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const userData = req.body as { name: string; email: string };

    if (!userData.name || !userData.email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      });
    }

    // Check if user with email already exists
    const existingUser = await userOperations.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const newUser = await userOperations.createUser(
      userData.name,
      userData.email,
    );

    // Clear cache for users list
    await cacheOperations.del('users:all');

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: String(error),
    });
    return;
  }
});

// Update user

app.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params['id'] ?? '', 10);
    const userData = req.body as { name: string; email: string };

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    if (!userData.name || !userData.email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      });
    }

    // Check if user exists
    const existingUser = await userOperations.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if email is already taken by another user
    const userWithEmail = await userOperations.getUserByEmail(userData.email);
    if (userWithEmail && (userWithEmail as { id: number }).id !== userId) {
      return res.status(409).json({
        success: false,
        error: 'Email is already taken by another user',
      });
    }

    const updatedUser = await userOperations.updateUser(
      userId,
      userData.name,
      userData.email,
    );

    // Clear related caches
    await cacheOperations.del('users:all');
    await cacheOperations.del(`user:${String(userId)}`);

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: String(error),
    });
    return;
  }
});

// Delete user

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params['id'] ?? '', 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    // Check if user exists
    const existingUser = await userOperations.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const deletedUser = await userOperations.deleteUser(userId);

    // Clear related caches
    await cacheOperations.del('users:all');
    await cacheOperations.del(`user:${String(userId)}`);

    res.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: String(error),
    });
  }
});

// 404 handler

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const server = app.listen(PORT, () => {
  const portString = String(PORT);
  logger.info(`🚀 Server running on http://localhost:${portString}`);
  logger.info(`📊 Health check: http://localhost:${portString}/health`);
  logger.info(`👥 Users API: http://localhost:${portString}/api/users`);

  // Initialize services after server starts
  initializeServices().catch((error: unknown) => {
    logger.error('Failed to initialize services:', error);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default app;
