import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogItem from '../components/LogItem';
import '../style/ActivityLog.css';

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ adminName: '', action: '', date: '' });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);
        return () => clearTimeout(timerId);
    }, [filters]);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const activeFilters = {};
                if (debouncedFilters.adminName) activeFilters.adminName = debouncedFilters.adminName;
                if (debouncedFilters.action) activeFilters.action = debouncedFilters.action;
                if (debouncedFilters.date) activeFilters.date = debouncedFilters.date;

                const res = await axios.get('http://localhost:5000/api/user/admin/activity-log', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: activeFilters 
                });
                setLogs(res.data.data);
            } catch (err) {
                setError('No se pudo cargar el registro de actividad.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [debouncedFilters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    return (
        <>
            <header className="admin-header">
                <h1>Registro de Actividad</h1>
            </header>

            <div className="filter-container">
                <input 
                    type="text" 
                    name="adminName"
                    placeholder="Buscar por nombre de admin..." 
                    value={filters.adminName}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <select 
                    name="action"
                    value={filters.action}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="">Todas las acciones</option>
                    <option value="USER_CREATED">Usuario Creado</option>
                    <option value="USER_DELETED">Usuario Eliminado</option>
                    <option value="USER_UPDATED">Usuario Actualizado</option>
                    <option value="ORDER_STATUS_UPDATED">Pedido Actualizado</option>
                    <option value="ORDER_DELETED">Pedido Eliminado</option>
                    <option value="SUPPLIER_REQUEST_UPDATED">Solicitud Gestionada</option>
                    <option value="SUPPORT_MESSAGE_REPLIED">Soporte Respondido</option>
                </select>
                <input 
                    type="date" 
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
            </div>

            {loading && <p>Cargando registros...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <div className="log-list">
                    {logs.length > 0 ? (
                        logs.map(log => <LogItem key={log.id} log={log} />)
                    ) : (
                        <div className="no-logs-message">
                            No se encontraron registros con los filtros aplicados.
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ActivityLogPage;