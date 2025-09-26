import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API_URL = `${API_BASE_URL}/user`;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const updateProfilePicture = async (userId, formData) => {
    try {
        const response = await api.put(`/${userId}/picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar la foto de perfil');
    }
};

// --- NUEVA FUNCIÓN PARA ELIMINAR LA FOTO ---
export const deleteProfilePicture = async (userId) => {
    try {
        const response = await api.delete(`/${userId}/picture`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar la foto de perfil');
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar el usuario');
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await api.post('/change-password', passwordData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al cambiar la contraseña');
    }
};

export const deleteAccount = async (userId) => {
    try {
        const response = await api.delete(`/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar la cuenta');
    }
};