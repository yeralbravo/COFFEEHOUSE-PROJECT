import axios from 'axios';

const API_URL = 'http://localhost:5000/api/supplier';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Obtiene los datos del dashboard para el proveedor.
 * @param {string} range - 'day', 'week', 'month', 'year'.
 */
export const getDashboardData = async (range) => {
    try {
        const response = await api.get(`/stats?range=${range}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los datos del dashboard');
    }
};

// ... (después de getDashboardData)

/**
 * Obtiene los datos del reporte de ventas para el proveedor.
 * @param {string} range - 'day', 'week', 'month', 'year'.
 */
export const getSalesReport = async (range) => {
    try {
        const response = await api.get(`/sales-report?range=${range}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener el reporte de ventas');
    }
};

// ... (después de getSalesReport)

/**
 * Obtiene las estadísticas de productos para el proveedor.
 */
export const getProductStats = async () => {
    try {
        const response = await api.get('/product-stats');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas de productos');
    }
};

// ... (después de getProductStats)

/**
 * Obtiene las estadísticas de pedidos para el proveedor.
 * @param {string} range - 'day', 'week', 'month', 'year'.
 */
export const getOrderStats = async (range) => {
    try {
        const response = await api.get(`/order-stats?range=${range}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas de pedidos');
    }
};

// ... (después de getOrderStats)

/**
 * Obtiene los ítems con bajo stock para el proveedor.
 */
export const getLowStockItems = async () => {
    try {
        const response = await api.get('/low-stock-items');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los ítems con bajo stock');
    }
};