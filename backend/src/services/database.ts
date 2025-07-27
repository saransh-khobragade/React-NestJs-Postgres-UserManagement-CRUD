import dotenv from 'dotenv';
import { Pool, type PoolClient } from 'pg';
import logger from './logger.js';

dotenv.config();

// Database configuration
const dbConfig = {
  connectionString:
    process.env['DATABASE_URL'] ??
    'postgresql://postgres:postgres123@localhost:5432/node_api_db',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    return false;
  }
};

// Get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

// Execute a query
export const query = async (
  text: string,
  params?: unknown[],
): Promise<{ rows: unknown[]; rowCount: number | null }> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

// Close the pool
export const closePool = async (): Promise<void> => {
  await pool.end();
};

// User operations
export const userOperations = {
  // Get all users
  getAllUsers: async (): Promise<unknown[]> => {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<unknown> => {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<unknown> => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Create user
  createUser: async (name: string, email: string): Promise<unknown> => {
    const result = await query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email],
    );
    return result.rows[0];
  },

  // Update user
  updateUser: async (
    id: number,
    name: string,
    email: string,
  ): Promise<unknown> => {
    const result = await query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id],
    );
    return result.rows[0];
  },

  // Delete user
  deleteUser: async (id: number): Promise<unknown> => {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [
      id,
    ]);
    return result.rows[0];
  },
};

export default pool;
