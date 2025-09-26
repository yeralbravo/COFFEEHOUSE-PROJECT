import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API_URL = `${API_BASE_URL}/products`;

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

// --- FUNCIÓN MODIFICADA ---
export const getSupplierProducts = async (searchTerm) => {
    try {
        const params = new URLSearchParams();
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        const response = await api.get(`/my-products?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los productos');
    }
};

export const createProduct = async (formData) => {
    try {
        const response = await api.post('/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al crear el producto');
    }
};

export const updateProduct = async (productId, formData) => {
    try {
        const response = await api.put(`/${productId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar el producto');
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/${productId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar el producto');
    }
};

export const getPublicProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/public`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los productos públicos');
    }
};

export const getProductById = async (productId) => {
    try {
        const response = await api.get(`/${productId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener el detalle del producto');
    }
};