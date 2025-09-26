import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
    ? '/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const API_URL = `${API_BASE_URL}/cart`;

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
