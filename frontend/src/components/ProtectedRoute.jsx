import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        // Si no está logueado, lo mandamos al login, guardando la página que quería visitar.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // --- LÓGICA CORREGIDA ---
    // Si se requiere un rol específico (o una lista de roles)
    if (role) {
        const allowedRoles = Array.isArray(role) ? role : [role];
        // Si el rol del usuario no está en la lista de roles permitidos, lo redirigimos.
        if (!allowedRoles.includes(user.role)) {
            // Redirigir según el rol del usuario a su página principal
            if (user.role === 'admin') return <Navigate to="/admin" replace />;
            if (user.role === 'supplier') return <Navigate to="/home" replace />; // Los proveedores ahora usan /home
            return <Navigate to="/home" replace />; // Por defecto, a /home
        }
    }

    // Si todo está bien, mostramos la página solicitada.
    return children;
};
 
export default ProtectedRoute;