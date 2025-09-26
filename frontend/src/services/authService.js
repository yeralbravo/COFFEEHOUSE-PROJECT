import axios from 'axios';

// ====================================================================
// ESTA LÓGICA ES LA CORRECTA Y YA ESTÁ EN TODOS TUS ARCHIVOS
const API_BASE_URL = import.meta.env.PROD 
    ? '/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const API_URL = `${API_BASE_URL}/auth`;
// ====================================================================

/**
 * Función de inicio de sesión (Login).
 * Se asume que estaba usando la URL completa sin la variable.
 */
export const login = async (email, password) => {
    try {
        // CORREGIDO: Usando la variable API_URL definida arriba.
        const response = await axios.post(`${API_URL}/login`, { email, password }); 
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error de inicio de sesión');
    }
};

/**
 * Función de registro (Register).
 * Esta es la que estaba fallando en el navegador.
 */
export const register = async (userData) => {
    try {
        // CORREGIDO: Usando la variable API_URL definida arriba.
        const response = await axios.post(`${API_URL}/register`, userData); 
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error de registro');
    }
};

// Esta función solicita al backend que genere un código de recuperación.
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al solicitar el reinicio de contraseña');
    }
};

// Esta función envía el código y la nueva contraseña al backend para la actualización.
export const resetPasswordWithCode = async (email, code, password) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password-with-code`, { email, code, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar la contraseña');
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

// Puedes añadir una función para verificar el estado de autenticación
export const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { isAuthenticated: false };

    try {
        // CORREGIDO: Usando la variable API_URL definida arriba.
        const response = await axios.get(`${API_URL}/check-auth`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { isAuthenticated: true, user: response.data.user };
    } catch (error) {
        // Token expirado o inválido, limpiar token
        localStorage.removeItem('token');
        return { isAuthenticated: false };
    }
};