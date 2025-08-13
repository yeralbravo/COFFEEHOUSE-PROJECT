import React, { useState, useEffect } from 'react';
import { fetchAllMessages, markAsRead } from '../services/contactService';
import { FiMail } from 'react-icons/fi';
import '../style/SupportPage.css';

const SupportPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

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

    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
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

    return (
        <div className="support-page-layout">
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