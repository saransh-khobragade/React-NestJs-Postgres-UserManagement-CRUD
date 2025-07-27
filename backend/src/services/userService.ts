import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from '../types/index.js';

// In-memory storage for demo purposes
// In a real app, this would be a database
const users = new Map<number, User>();

// Simple ID generator for demo purposes
const generateId = (): number => {
  return Date.now();
};

export const UserService = {
  createUser(userData: CreateUserRequest): User {
    const id = generateId();
    const now = new Date().toISOString();

    const user: User = {
      id,
      name: userData.name,
      email: userData.email,
      created_at: now,
      updated_at: now,
    };

    users.set(id, user);
    return user;
  },

  getUserById(id: number): User | null {
    const user = users.get(id);
    return user ?? null;
  },

  getAllUsers(
    page = 1,
    limit = 10,
  ): {
    users: readonly User[];
    total: number;
    totalPages: number;
  } {
    const userArray = Array.from(users.values());
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = userArray.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total: userArray.length,
      totalPages: Math.ceil(userArray.length / limit),
    };
  },

  updateUser(id: number, updateData: UpdateUserRequest): User | null {
    const existingUser = users.get(id);
    if (existingUser === undefined) {
      return null;
    }

    const updatedUser: User = {
      ...existingUser,
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    users.set(id, updatedUser);
    return updatedUser;
  },

  deleteUser(id: number): boolean {
    return users.delete(id);
  },

  userExists(id: number): boolean {
    return users.has(id);
  },
};
