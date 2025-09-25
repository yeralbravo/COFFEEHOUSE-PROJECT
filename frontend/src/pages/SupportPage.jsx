import React, { useState, useEffect } from 'react';
import { fetchAllMessages, markAsRead } from '../services/contactService';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import '../style/SupportPage.css';

const SupportPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isDetailView, setIsDetailView] = useState(false); // Nuevo estado para vista móvil

    // Detectar si estamos en una pantalla móvil
    const isMobile = () => window.innerWidth <= 767;

    const loadMessages = async () => {
        try {
            setLoading(true);
            const response = await fetchAllMessages();
            if (response.success) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    // Efecto para manejar el cambio de tamaño de la ventana
    useEffect(() => {
        const handleResize = () => {
            if (!isMobile() && isDetailView) {
                setIsDetailView(false); // Si la pantalla se agranda, salimos de la vista de detalle móvil
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDetailView]);


    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        if (isMobile()) {
            setIsDetailView(true); // Entrar en modo detalle en móvil
        }
        if (!message.is_read) {
            try {
                await markAsRead(message.id);
                const updatedMessages = messages.map(m =>
                    m.id === message.id ? { ...m, is_read: true } : m
                );
                setMessages(updatedMessages);
            } catch (error) {
                console.error("Error al marcar como leído:", error);
            }
        }
    };

    const handleBackToList = () => {
        setIsDetailView(false);
    };

    return (
        <div className={`support-page-layout ${isDetailView ? 'show-detail' : ''}`}>
            <div className="message-list-panel">
                <header className="panel-header">
                    <h1>Bandeja de Entrada</h1>
                    <p>{messages.filter(m => !m.is_read).length} mensajes nuevos</p>
                </header>
                <div className="message-list">
                    {loading ? <p>Cargando mensajes...</p> : messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`message-item ${selectedMessage?.id === msg.id ? 'active' : ''} ${!msg.is_read ? 'unread' : ''}`}
                            onClick={() => handleSelectMessage(msg)}
                        >
                            <div className="sender-info">
                                <span className="sender-name">{msg.name}</span>
                                <span className="message-date">{new Date(msg.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="message-preview">{msg.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="message-detail-panel">
                {selectedMessage ? (
                    <>
                        <header className="panel-header detail-header">
                            {/* Botón de volver para móvil */}
                            {isDetailView && (
                                <button onClick={handleBackToList} className="back-to-list-btn">
                                    <FiArrowLeft /> Volver
                                </button>
                            )}
                            <div>
                                <h2>{selectedMessage.name}</h2>
                                <a href={`mailto:${selectedMessage.email}`} className="sender-email">{selectedMessage.email}</a>
                                {selectedMessage.phone && <p className="sender-phone">Tel: {selectedMessage.phone}</p>}
                            </div>
                            <span className="message-timestamp">
                                {new Date(selectedMessage.created_at).toLocaleString('es-CO')}
                            </span>
                        </header>
                        <div className="message-body">
                            {selectedMessage.message}
                        </div>
                    </>
                ) : (
                    <div className="no-message-selected">
                        <FiMail size={50} />
                        <p>Selecciona un mensaje para leerlo</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportPage;