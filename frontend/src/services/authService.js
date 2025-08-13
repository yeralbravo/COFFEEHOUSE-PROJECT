import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

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