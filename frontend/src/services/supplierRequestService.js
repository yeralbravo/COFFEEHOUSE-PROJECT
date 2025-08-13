import axios from 'axios';

const API_URL = 'http://localhost:5000/api/supplier-requests';

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

// --- NUEVA FUNCIÓN DE VALIDACIÓN ---
/**
 * Valida en tiempo real si un campo ya está en uso.
 * @param {'email' | 'phone'} field - El campo a validar.
 * @param {string} value - El valor del campo.
 */
export const validateField = async (field, value) => {
    try {
        // Usamos axios directamente porque es una ruta pública
        const response = await axios.post(`${API_URL}/validate`, { field, value });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al validar el campo');
    }
};


export const getAllRequests = async (status) => {
    try {
        const response = await api.get(`/admin?status=${status}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las solicitudes');
    }
};

export const updateRequestStatus = async (requestId, status) => {
    try {
        const response = await api.put(`/admin/${requestId}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar la solicitud');
    }
};