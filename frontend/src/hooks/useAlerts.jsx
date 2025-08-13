import { useCallback } from 'react'; // <-- 1. Importar useCallback
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useAlerts = () => {

    // 2. Envolver cada función con useCallback
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

    const showConfirmDialog = useCallback(({ title, text }) => {
        return MySwal.fire({
            title: <p>{title}</p>,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1a4d2e',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        });
    }, []);

    return { showSuccessAlert, showErrorAlert, showConfirmDialog };
};