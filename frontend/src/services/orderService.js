import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API_URL = `${API_BASE_URL}/orders`;

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

export const cancelOrder = async (orderId) => {
    try {
        const response = await api.put(`/${orderId}/cancel`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al cancelar el pedido');
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/', orderData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al crear la orden');
    }
};

export const getMyOrders = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await api.get(`/my-orders?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'No se pudieron obtener las órdenes.');
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener el detalle del pedido');
    }
};

export const getAllOrders = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await api.get(`/admin/all?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener todas las órdenes');
    }
};

export const updateOrderStatus = async (orderId, updateData) => {
    try {
        const response = await api.put(`/admin/${orderId}`, updateData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar la orden');
    }
};

export const getSupplierOrders = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        
        const response = await api.get(`/supplier/my-orders?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los pedidos');
    }
};

export const getSupplierOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/supplier/details/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los detalles del pedido');
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const response = await api.delete(`/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al eliminar el pedido');
    }
};

export const updateOrderStatusBySupplier = async (orderId, updateData) => {
    try {
        const response = await api.put(`/supplier/${orderId}`, updateData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar la orden');
    }
};

// --- NUEVA FUNCIÓN AÑADIDA ---
export const getAdminOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/admin/details/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los detalles del pedido');
    }
};