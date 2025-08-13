import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para añadir el token a las peticiones protegidas
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Crea una nueva reseña.
 * @param {object} reviewData - { orderItemId, rating, comment, type, itemId }
 */
export const createReview = async (reviewData) => {
    try {
        const response = await api.post('/', reviewData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al enviar la reseña');
    }
};

/**
 * Obtiene las reseñas de un producto o insumo.
 * @param {'product' | 'insumo'} type
 * @param {number} itemId
 */
export const getReviews = async (type, itemId) => {
    try {
        // Esta es una ruta pública, no necesita el 'api' con token
        const response = await axios.get(`${API_URL}/${type}/${itemId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al obtener las reseñas');
    }
};