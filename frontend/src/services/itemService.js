import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

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
 * Actualiza el stock de un ítem.
 * @param {'product' | 'insumo'} itemType - 'product' o 'insumo'.
 * @param {string} itemId - El ID del ítem.
 * @param {number} stock - El nuevo valor del stock.
 */
export const updateItemStock = async (itemType, itemId, stock) => {
    try {
        const itemTypeForApi = itemType === 'Café' ? 'product' : 'insumo';
        const response = await api.put(`/${itemTypeForApi}/${itemId}/stock`, { stock });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar el stock');
    }
};