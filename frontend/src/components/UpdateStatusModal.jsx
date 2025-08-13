import React, { useState } from 'react';
import '../style/Modal.css';

const UpdateStatusModal = ({ order, onSave, onClose }) => {
    const [status, setStatus] = useState(order.status);
    const [shippingCompany, setShippingCompany] = useState(order.shipping_company || '');
    const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');

    const handleSave = () => {
        onSave(order.id, {
            status,
            shipping_company: shippingCompany,
            tracking_number: trackingNumber,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Actualizar Pedido #{order.id}</h2>
                <div className="form-group">
                    <label>Estado del Pedido</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
                {status === 'Enviado' && (
                    <>
                        <div className="form-group">
                            <label>Empresa de Envío</label>
                            <input
                                type="text"
                                value={shippingCompany}
                                onChange={(e) => setShippingCompany(e.target.value)}
                                placeholder="Ej: Servientrega"
                            />
                        </div>
                        <div className="form-group">
                            <label>Número de Guía</label>
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Ej: 0123456789"
                            />
                        </div>
                    </>
                )}
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={handleSave} className="btn-save">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateStatusModal;