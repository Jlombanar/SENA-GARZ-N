import express from 'express';
import { login, updateProfile } from '../controllers/authController.js';
import { register } from '../controllers/registerController.js';
import { forgotPassword } from '../controllers/forgotPasswordController.js';
import { resetPassword } from '../controllers/resetPasswordController.js';
import { getAllUsers, deleteUser, updateUser, getAdminStats, getAdminNotifications, migrarInstructores } from '../controllers/adminController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Rutas protegidas
router.put('/users/profile', verificarToken, updateProfile);

// Rutas de admin
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.get('/admin/stats', verificarToken, esAdmin, getAdminStats);
router.get('/admin/notifications', verificarToken, esAdmin, getAdminNotifications);
router.post('/admin/migrar-instructores', verificarToken, esAdmin, migrarInstructores);

export default router;