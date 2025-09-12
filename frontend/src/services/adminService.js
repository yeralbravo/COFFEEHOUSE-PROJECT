import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

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

export const getDashboardStats = async (params) => {
    try {
        const response = await api.get(`/stats`, { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas del dashboard');
    }
};

export const fetchSalesStats = async (params) => {
    try {
        const response = await api.get(`/stats/sales`, { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de ventas');
    }
};

export const fetchProductStats = async (params) => {
    try {
        const response = await api.get(`/stats/products`, { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de productos');
    }
};

export const fetchUserStats = async (params) => {
    try {
        const response = await api.get(`/stats/users`, { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de usuarios');
    }
};

// --- FUNCIÓN MODIFICADA ---
export const fetchOrderStats = async (params) => {
    try {
        const response = await api.get(`/stats/orders`, { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de pedidos');
    }
};