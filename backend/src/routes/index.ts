import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from './userRoutes.js';
import { Router } from 'express';

// eslint-disable-next-line new-cap
const router = Router();

// User CRUD routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export { router as userRoutes };
