import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API_URL = `${API_BASE_URL}/catalog`;

/**
 * Obtiene todos los datos necesarios para la página de inicio del cliente.
 */
export const getHomePageData = async () => {
    try {
        const response = await axios.get(`${API_URL}/home-sections`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener los datos de la página de inicio');
    }
};