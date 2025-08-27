import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';
import { uploadProfilePicture } from '../middleware/uploadMiddleware.js';
import {
    showUsers,
    deleteUserById,
    editUsers,
    findUserById,
    createUser,
    findUserByEmail,
    findUserByPhone,
    getUserStats,
    changePassword
} from '../models/User.js';
import { logAdminActivity, getActivityLogs } from '../models/ActivityLog.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// ... (El resto de tus rutas como /picture, /admin, etc., no cambian)

// ================== RUTA MODIFICADA ==================
router.post('/change-password',
    [
        verifyToken,
        body('currentPassword').notEmpty().withMessage('La contraseña actual es obligatoria.'),
        body('newPassword').isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .withMessage('La contraseña debe contener mayúscula, minúscula, número y un carácter especial.'),
        // --- Validación añadida para asegurar que las contraseñas coincidan ---
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Las nuevas contraseñas no coinciden.');
            }
            return true;
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array()[0].msg });
        }

        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        try {
            const result = await changePassword(userId, currentPassword, newPassword);
            if (!result.success) {
                return res.status(401).json({ success: false, error: result.error });
            }
            res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente.' });
        } catch (error) {
            console.error("Error en la ruta de cambio de contraseña:", error);
            res.status(500).json({ success: false, error: 'Error interno del servidor.' });
        }
    }
);

export default router;
