import axios from 'axios';

const API_URL = 'http://localhost:5000/api/search';

export const searchProducts = async (query) => {
    try {
        const response = await axios.get(`${API_URL}?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al buscar productos');
    }
};