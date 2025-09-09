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

// --- FUNCIÓN MODIFICADA ---
export const fetchSalesStats = async (params) => {
    try {
        const response = await api.get(`/stats/sales`, { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de ventas');
    }
};

export const fetchProductStats = async (range) => {
    try {
        const response = await api.get(`/stats/products?range=${range}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de productos');
    }
};

export const fetchUserStats = async (range) => {
    try {
        const response = await api.get(`/stats/users?range=${range}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de usuarios');
    }
};

export const fetchOrderStats = async (range) => {
    try {
        const response = await api.get(`/stats/orders?range=${range}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de pedidos');
    }
};