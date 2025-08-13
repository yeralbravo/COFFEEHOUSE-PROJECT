import React, { useState, useEffect } from 'react';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/orderService'; // <-- 1. Importar deleteOrder
import { useAlerts } from '../hooks/useAlerts';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // <-- 2. Importar FiTrash2
import '../style/UserList.css';
import '../style/AdminPanel.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts(); // <-- 3. Incluir showConfirmDialog

    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
    });

    const fetchOrders = async () => {
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
    };

    useEffect(() => {
        fetchOrders();
    }, [filters]);

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

    // --- 4. AÑADIR FUNCIÓN PARA MANEJAR LA ELIMINACIÓN ---
    const handleDelete = (orderId) => {
        showConfirmDialog({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará el pedido permanentemente y no se podrá revertir."
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteOrder(orderId);
                    showSuccessAlert('Pedido eliminado correctamente.');
                    fetchOrders(); // Recargar la lista de pedidos
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
                                    <td>#{order.id}</td>
                                    <td>{order.user_name} {order.user_lastname}</td>
                                    <td>{order.date}</td>
                                    <td>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</td>
                                    <td><span className={`role-badge role-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    <td>
                                        {/* --- 5. AÑADIR BOTÓN DE ELIMINAR --- */}
                                        <div className="action-buttons">
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
        </>
    );
};

export default AdminOrdersPage;