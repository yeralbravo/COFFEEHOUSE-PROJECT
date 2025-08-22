import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payment';

/**
 * Llama al backend para crear una preferencia de pago en Mercado Pago.
 * @param {object} orderData - Los datos de la orden (ej: { cartItems: [...], orderId: '...' }).
 * @returns {Promise<object>} La respuesta del servidor con la URL de pago.
 */
export const createPaymentOrder = async (orderData) => {
    // Obtenemos el token de autenticación del usuario
    const token = localStorage.getItem('token');
    
    // Hacemos la petición POST a nuestro backend
    const response = await axios.post(`${API_URL}/create-order`, orderData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return response.data;
};