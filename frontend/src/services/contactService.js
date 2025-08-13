import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contact';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para añadir el token a las peticiones de admin
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Envía un mensaje desde el formulario de contacto público.
 * @param {object} contactData - { name, email, phone, message }
 */
export const sendContactMessage = async (contactData) => {
    try {
        // Usamos axios directamente porque es una ruta pública
        const response = await axios.post(API_URL, contactData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al enviar el mensaje');
    }
};

/**
 * Obtiene todos los mensajes de contacto (solo para admin).
 */
export const fetchAllMessages = async () => {
    try {
        const response = await api.get('/admin');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los mensajes de soporte');
    }
};

/**
 * Marca un mensaje como leído (solo para admin).
 */
export const markAsRead = async (messageId) => {
    try {
        const response = await api.put(`/admin/${messageId}/read`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al marcar el mensaje como leído');
    }
};