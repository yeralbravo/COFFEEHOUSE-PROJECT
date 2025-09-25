import React, { useState, useEffect, useCallback } from 'react';
import UpdateStatusModal from '../components/UpdateStatusModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { getAllOrders, updateOrderStatus, deleteOrder, getAdminOrderDetails } from '../services/orderService';
import { useAlerts } from '../hooks/useAlerts';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import '../style/UserList.css';
import '../style/AdminPanel.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();

    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
    });

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllOrders(filters);
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    }, [filters, showErrorAlert]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleOpenModal = (order) => setEditingOrder(order);
    const handleCloseModal = () => setEditingOrder(null);

    const handleSaveStatus = async (orderId, updateData) => {
        try {
            const response = await updateOrderStatus(orderId, updateData);
            showSuccessAlert(response.message);
            handleCloseModal();
            fetchOrders();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };
    
    const handleViewDetails = async (orderId) => {
        try {
            const response = await getAdminOrderDetails(orderId);
            if (response.success) {
                setViewingOrder(response.data);
            }
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const handleDelete = (orderId) => {
        showConfirmDialog({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará el pedido permanentemente."
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteOrder(orderId);
                    showSuccessAlert('Pedido eliminado correctamente.');
                    fetchOrders();
                } catch (error) {
                    showErrorAlert(error.message);
                }
            }
        });
    };

    return (
        <>
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
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="filter-input" />
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
                                    <td data-label="ID Pedido">#{order.id}</td>
                                    <td data-label="Cliente">{order.user_name} {order.user_lastname}</td>
                                    <td data-label="Fecha">{order.date}</td>
                                    <td data-label="Total">${new Intl.NumberFormat('es-CO').format(order.total_amount)}</td>
                                    <td data-label="Estado"><span className={`role-badge role-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    <td data-label="Acciones">
                                        <div className="action-buttons">
                                            <button onClick={() => handleViewDetails(order.id)} className="action-btn view-btn" title="Ver Detalles">
                                                <FiEye />
                                            </button>
                                            <button onClick={() => handleOpenModal(order)} className="action-btn edit-btn" title="Editar Estado">
                                                <FiEdit />
                                            </button>
                                            <button onClick={() => handleDelete(order.id)} className="action-btn delete-btn" title="Eliminar Pedido">
                                                <FiTrash2 />
                                            </button>
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
                    onClose={handleCloseModal}
                />
            )}
            
            {viewingOrder && (
                <OrderDetailsModal
                    order={viewingOrder}
                    onClose={() => setViewingOrder(null)}
                />
            )}
        </>
    );
};

export default AdminOrdersPage;