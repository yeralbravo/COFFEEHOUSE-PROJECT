import React, { useState, useEffect, useCallback } from 'react';
import OrderCard from '../components/client/OrderCard';
import { getMyOrders } from '../services/orderService';
import '../style/MyOrdersPage.css';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
    });

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getMyOrders(filters);
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error("Error al cargar las órdenes:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const groupedOrders = orders.reduce((acc, order) => {
        const date = order.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(order);
        return acc;
    }, {});

    return (
        <main className="orders-main-content">
            <div className="orders-header">
                <h1>Mis Pedidos</h1>
            </div>
            
            <div className="filter-container">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                <input 
                    type="date" 
                    name="startDate" 
                    value={filters.startDate} 
                    onChange={handleFilterChange} 
                    className="filter-input" 
                    aria-label="Fecha de inicio"
                />
                
            </div>

            <div className="orders-list">
                {loading ? <p>Cargando tus pedidos...</p> : Object.keys(groupedOrders).length === 0 ? (
                    <p>No se encontraron pedidos con los filtros aplicados.</p>
                ) : (
                    Object.entries(groupedOrders).map(([date, ordersOnDate]) => (
                        <div key={date} className="order-group">
                            <h2 className="date-header">{date}</h2>
                            <div className="orders-in-group">
                                {ordersOnDate.map(order => (
                                    // Comprobación de seguridad: solo renderizar si hay items
                                    (order.items && order.items.length > 0) 
                                        ? <OrderCard key={order.id} order={order} />
                                        : null
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
};

export default MyOrdersPage;