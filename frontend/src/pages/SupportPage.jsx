import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllMessages, replyToMessage } from '../services/contactService';
import { useAlerts } from '../hooks/useAlerts';
import { FiMail, FiSend, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import '../style/SupportPage.css';

const SupportPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [filter, setFilter] = useState('pending');
    const { showSuccessAlert, showErrorAlert } = useAlerts();
    const [showDetailView, setShowDetailView] = useState(false);

    const loadMessages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchAllMessages(filter);
            if (response.success) {
                setMessages(response.data);
            }
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    }, [filter, showErrorAlert]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    useEffect(() => {
        setSelectedMessage(null);
    }, [filter]);

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
        setReplyText('');
        setShowDetailView(true);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedMessage) return;
        
        setIsReplying(true);
        try {
            const response = await replyToMessage(selectedMessage.id, replyText);
            showSuccessAlert(response.message);
            setReplyText('');
            loadMessages();
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setIsReplying(false);
        }
    };

    const unreadCount = messages.filter(m => m.status === 'pending').length;

    return (
        <div className={`support-page-layout ${showDetailView ? 'show-detail' : ''}`}>
            <div className="message-list-panel">
                <header className="panel-header">
                    <h1>Bandeja de Entrada</h1>
                    {filter === 'pending' && <p>{unreadCount} mensajes nuevos</p>}
                </header>
                <div className="filter-tabs">
                    <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pendientes</button>
                    <button onClick={() => setFilter('replied')} className={filter === 'replied' ? 'active' : ''}>Respondidos</button>
                </div>
                <div className="message-list">
                    {loading ? <p>Cargando mensajes...</p> : messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`message-item ${selectedMessage?.id === msg.id ? 'active' : ''}`}
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
                            <button className="back-to-list-btn" onClick={() => setShowDetailView(false)}>
                                <FiArrowLeft /> Volver
                            </button>
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
                            <p>{selectedMessage.message}</p>
                        </div>
                        
                        {selectedMessage.status === 'replied' ? (
                            <div className="replied-section">
                                <div className="replied-header">
                                    <FiCheckCircle />
                                    <h4>Respuesta Enviada</h4>
                                </div>
                                <p className="replied-meta">
                                    Respondido por <strong>{selectedMessage.admin_name || 'Admin'}</strong> el {new Date(selectedMessage.replied_at).toLocaleString('es-CO')}
                                </p>
                                <div className="replied-message">
                                    {selectedMessage.reply_message}
                                </div>
                            </div>
                        ) : (
                            <footer className="reply-footer">
                                {/* --- ESTRUCTURA MODIFICADA --- */}
                                <form onSubmit={handleReplySubmit} className="reply-form">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Responder a ${selectedMessage.name}...`}
                                        className="reply-textarea"
                                        disabled={isReplying}
                                    />
                                    <div className="reply-actions">
                                        <button type="submit" className="reply-button" disabled={isReplying || !replyText.trim()}>
                                            {isReplying ? 'Enviando...' : <><FiSend /> Responder</>}
                                        </button>
                                    </div>
                                </form>
                            </footer>
                        )}
                    </>
                ) : (
                    <div className="no-message-selected">
                        <FiMail size={50} />
                        <p>Selecciona un mensaje para leerlo y responder</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportPage;