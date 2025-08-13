import React, { useState, useEffect } from 'react';
import { getSupplierOrders, deleteOrder, updateOrderStatusBySupplier } from '../services/orderService';
import { useAlerts } from '../hooks/useAlerts';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import UpdateStatusModal from '../components/UpdateStatusModal';
import '../style/UserList.css';
import '../style/AdminPanel.css';

const SupplierOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();

    const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getSupplierOrders(filters);
            if (response.success) setOrders(response.data);
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDelete = (orderId) => {
        showConfirmDialog({ title: '¿Estás seguro?', text: 'Este pedido se eliminará permanentemente.' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteOrder(orderId);
                        showSuccessAlert('Pedido eliminado.');
                        fetchOrders();
                    } catch (error) {
                        showErrorAlert(error.message);
                    }
                }
            });
    };

    const handleSaveStatus = async (orderId, updateData) => {
        try {
            await updateOrderStatusBySupplier(orderId, updateData);
            showSuccessAlert('Estado del pedido actualizado.');
            setEditingOrder(null);
            fetchOrders();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="supplier-orders-page">
            <header className="admin-header">
                <h1>Gestión de Pedidos</h1>
            </header>
            <div className="filter-container">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="filter-input" />
                
            </div>

            {loading ? <p>Cargando pedidos...</p> : (
                <div className="list-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID Pedido</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user_name} {order.user_lastname}</td>
                                    <td>{order.date}</td>
                                    <td>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</td>
                                    <td><span className={`role-badge role-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => setEditingOrder(order)} className="action-btn edit-btn"><FiEdit /></button>
                                            <button onClick={() => handleDelete(order.id)} className="action-btn delete-btn"><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingOrder && (
                <UpdateStatusModal
                    order={editingOrder}
                    onSave={handleSaveStatus}
                    onClose={() => setEditingOrder(null)}
                />
            )}
        </div>
    );
};

export default SupplierOrdersPage;