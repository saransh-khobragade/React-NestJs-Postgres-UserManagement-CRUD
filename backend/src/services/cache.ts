import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from './logger.js';
import type { CacheValue } from '../types/index.js';

dotenv.config();

// Redis configuration
const redisConfig = {
  url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
  },
};

// Create Redis client
const client = createClient(redisConfig);

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    await client.connect();
    logger.info('✅ Redis connection successful');
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    throw error;
  }
};

// Test Redis connection
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    await client.ping();
    logger.info('✅ Redis ping successful');
    return true;
  } catch (error) {
    logger.error('❌ Redis ping failed:', error);
    return false;
  }
};

// Cache operations
export const cacheOperations = {
  // Set cache with expiration
  set: async (
    key: string,
    value: string,
    expireSeconds?: number,
  ): Promise<void> => {
    try {
      if (expireSeconds !== undefined && expireSeconds > 0) {
        await client.setEx(key, expireSeconds, value);
      } else {
        await client.set(key, value);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  },

  // Get cache value
  get: async (key: string): Promise<string | null> => {
    try {
      return await client.get(key);
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  // Delete cache key
  del: async (key: string): Promise<void> => {
    try {
      await client.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  },

  // Set cache with JSON value
  setJson: async (
    key: string,
    value: CacheValue,
    expireSeconds?: number,
  ): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      if (expireSeconds !== undefined && expireSeconds > 0) {
        await client.setEx(key, expireSeconds, jsonValue);
      } else {
        await client.set(key, jsonValue);
      }
    } catch (error) {
      logger.error('Cache setJson error:', error);
    }
  },

  // Get cache value as JSON
  getJson: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await client.get(key);
      return value !== null ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache getJson error:', error);
      return null;
    }
  },

  // Clear all cache
  clear: async (): Promise<void> => {
    try {
      await client.flushAll();
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  },
};

// Close Redis connection
export const closeRedis = async (): Promise<void> => {
  await client.quit();
};

export default client;
