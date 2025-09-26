import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
    ? '/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const API_URL = `${API_BASE_URL}/supplier`;

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
 * @param {object} params - Un objeto que DEBE contener startDate y endDate.
 */
export const getDashboardData = async (params) => {
    try {
        // Construimos la URL con los parámetros que SÍ existen
        const url = `/stats?startDate=${params.startDate}&endDate=${params.endDate}`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        // Capturamos el error específico del backend para mostrarlo en la consola
        const errorMessage = error.response?.data?.error || 'Error al obtener los datos del dashboard';
        throw new Error(errorMessage);
    }
};

/**
 * Obtiene los datos del reporte de ventas para el proveedor.
 * @param {object} params - Un objeto que DEBE contener startDate y endDate.
 */
export const getSalesReport = async (params) => {
    try {
        const url = `/sales-report?startDate=${params.startDate}&endDate=${params.endDate}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener el reporte de ventas');
    }
};

// ================== FUNCIÓN ACTUALIZADA ==================
/**
 * Obtiene las estadísticas de productos para el proveedor.
 * @param {object} params - Un objeto que DEBE contener startDate y endDate.
 */
export const getProductStats = async (params) => {
    try {
        // Ahora la función envía las fechas al backend
        const url = `/product-stats?startDate=${params.startDate}&endDate=${params.endDate}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas de productos');
    }
};
// ================== FIN DE LA MODIFICACIÓN ==================

/**
 * Obtiene las estadísticas de pedidos para el proveedor.
 * @param {object} params - Un objeto que DEBE contener startDate y endDate.
 */
export const getOrderStats = async (params) => {
    try {
        const url = `/order-stats?startDate=${params.startDate}&endDate=${params.endDate}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas de pedidos');
    }
};

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