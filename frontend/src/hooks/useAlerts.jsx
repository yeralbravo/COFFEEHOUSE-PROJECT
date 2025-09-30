import { useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useAlerts = () => {

    const showSuccessAlert = useCallback((title) => {
        MySwal.fire({
            title: <p>{title}</p>,
            icon: 'success',
            confirmButtonColor: '#1a4d2e',
        });
    }, []);

    const showErrorAlert = useCallback((title) => {
        MySwal.fire({
            title: <p>{title}</p>,
            icon: 'error',
            confirmButtonColor: '#1a4d2e',
        });
    }, []);

    // --- FUNCIÓN MODIFICADA ---
    const showConfirmDialog = useCallback(({ title, text, confirmButtonText = 'Sí, confirmar' }) => {
        return MySwal.fire({
            title: <p>{title}</p>,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1a4d2e',
            cancelButtonColor: '#dc3545',
            confirmButtonText: confirmButtonText, // Usamos el texto dinámico
            cancelButtonText: 'Cancelar'
        });
    }, []);

    return { showSuccessAlert, showErrorAlert, showConfirmDialog };
};