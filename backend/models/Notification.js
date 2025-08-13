import db from '../config/db.js';
import { findAllAdminIds } from './User.js'; // Importamos la nueva función

/**
 * Crea una nueva notificación para un usuario.
 */
export const createNotification = async (userId, message, linkUrl = null) => {
  try {
    await db.query(
      'INSERT INTO notifications (user_id, message, link_url) VALUES (?, ?, ?)',
      [userId, message, linkUrl]
    );
  } catch (error) {
    console.error('Error al crear la notificación:', error);
  }
};

/**
 * Obtiene las notificaciones de un usuario.
 */
export const findNotificationsByUserId = async (userId) => {
  try {
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [userId]
    );
    return notifications;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error;
  }
};

/**
 * Marca todas las notificaciones no leídas de un usuario como leídas.
 */
export const markAllNotificationsAsRead = async (userId) => {
    try {
        const [result] = await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        return result;
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        throw error;
    }
};

/**
 * Elimina una notificación por su ID.
 */
export const deleteNotificationById = async (notificationId, userId) => {
    try {
        const [result] = await db.query(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
        return result;
    } catch (error) {
        console.error('Error al eliminar la notificación:', error);
        throw error;
    }
};

/**
 * Crea una notificación para todos los administradores.
 * @param {string} message - El mensaje de la notificación.
 * @param {string|null} linkUrl - Un enlace opcional.
 */
export const createNotificationForAllAdmins = async (message, linkUrl = null) => {
    try {
        const adminIds = await findAllAdminIds();
        if (adminIds.length === 0) return;

        const notifications = adminIds.map(adminId => [adminId, message, linkUrl]);
        
        await db.query(
            'INSERT INTO notifications (user_id, message, link_url) VALUES ?',
            [notifications]
        );
    } catch (error) {
        console.error('Error al crear notificación para todos los admins:', error);
    }
};