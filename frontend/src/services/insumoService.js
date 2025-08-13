import axios from 'axios';

const API_URL = 'http://localhost:5000/api/insumos';

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

export const getSupplierInsumos = async () => {
    try {
        const response = await api.get('/my-insumos');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los insumos');
    }
};

export const createInsumo = async (formData) => {
    try {
        const response = await api.post('/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al crear el insumo');
    }
};

// CORRECCIÓN: La función de actualización ahora puede manejar un FormData.
export const updateInsumo = async (insumoId, formData) => {
    try {
        const response = await api.put(`/${insumoId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar el insumo');
    }
};

export const deleteInsumo = async (insumoId) => {
    try {
        const response = await api.delete(`/${insumoId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar el insumo');
    }
};

export const getPublicInsumos = async () => {
    try {
        const response = await axios.get(`${API_URL}/public`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los insumos públicos');
    }
};

export const getInsumoById = async (insumoId) => {
    try {
        const response = await api.get(`/${insumoId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener el detalle del insumo');
    }
};
