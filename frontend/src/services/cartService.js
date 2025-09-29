import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getCart = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener el carrito.');
    }
};

export const addItem = async (itemId, quantity, isProduct) => {
    try {
        const response = await api.post('/', { itemId, quantity, isProduct });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al agregar ítem al carrito.');
    }
};

export const updateItemQuantity = async (itemId, quantity, isProduct) => {
    try {
        const response = await api.put('/', { itemId, quantity, isProduct });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar la cantidad.');
    }
};

export const removeItem = async (itemId, isProduct) => {
    try {
        const response = await api.delete('/', { data: { itemId, isProduct } });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar ítem del carrito.');
    }
};

export const clearCart = async () => {
    try {
        const response = await api.delete('/clear');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al vaciar el carrito.');
    }
};

export const removeMultipleItems = async (itemIds) => {
    try {
        const response = await api.post('/remove-items', { itemIds });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar ítems del carrito.');
    }
};