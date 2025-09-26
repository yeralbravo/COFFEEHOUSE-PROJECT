import axios from 'axios';

// 1. Lee la variable de entorno con un valor por defecto si no la encuentra
const API_BASE_URL = import.meta.env.PROD 
    ? '/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

// 2. Construye la URL específica para este servicio
const API_URL = `${API_BASE_URL}/addresses`;

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

export const getMyAddresses = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las direcciones.');
    }
};

export const createAddress = async (addressData) => {
    try {
        const response = await api.post('/', addressData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al guardar la dirección.');
    }
};

// ================== FUNCIÓN AÑADIDA ==================
export const updateAddress = async (addressId, addressData) => {
    try {
        const response = await api.put(`/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar la dirección.');
    }
};

export const deleteAddress = async (addressId) => {
    try {
        const response = await api.delete(`/${addressId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar la dirección.');
    }
};