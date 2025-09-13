import React from 'react';
import { FiX } from 'react-icons/fi';
import '../../style/RequestDetailsModal.css'; // Crearemos este archivo CSS en el siguiente paso

const RequestDetailsModal = ({ request, onClose }) => {
    if (!request) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Detalles de la Solicitud</h2>
                    <button onClick={onClose} className="close-button"><FiX /></button>
                </header>
                <div className="modal-body">
                    <div className="detail-section">
                        <h4>Datos de la Empresa</h4>
                        <p><strong>Nombre:</strong> {request.company_name}</p>
                        <p><strong>NIT:</strong> {request.nit}</p>
                    </div>
                    <div className="detail-section">
                        <h4>Datos de Contacto</h4>
                        <p><strong>Persona de Contacto:</strong> {request.contact_person}</p>
                        <p><strong>Correo Electrónico:</strong> {request.email}</p>
                        <p><strong>Teléfono:</strong> {request.phone}</p>
                    </div>
                    <div className="detail-section">
                        <h4>Información Adicional</h4>
                        <p><strong>Dirección:</strong> {request.address || 'No especificada'}</p>
                        <p><strong>Ciudad:</strong> {request.city || 'No especificada'}</p>
                        <p><strong>Tipos de Producto:</strong> {request.product_types}</p>
                        {request.message && (
                            <div className="message-box">
                                <strong>Mensaje:</strong>
                                <p>{request.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;