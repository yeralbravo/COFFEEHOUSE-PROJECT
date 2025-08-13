import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Obtiene las notificaciones del usuario logueado.
 */
export const getMyNotifications = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener notificaciones');
    }
};

/**
 * Marca todas las notificaciones como leídas.
 */
export const markAllAsRead = async () => {
    try {
        const response = await api.put('/read-all');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al marcar las notificaciones');
    }
};

/**
 * Elimina una notificación.
 * @param {number} notificationId
 */
export const deleteNotification = async (notificationId) => {
    try {
        const response = await api.delete(`/${notificationId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar la notificación');
    }
};