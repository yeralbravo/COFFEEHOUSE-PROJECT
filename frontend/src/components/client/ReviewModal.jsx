import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAlerts } from '../../hooks/useAlerts';
import { createReview } from '../../services/reviewService';
import '../../style/ReviewModal.css';

// eslint-disable-next-line no-unused-vars
const ReviewModal = ({ item, orderId, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const { showSuccessAlert, showErrorAlert } = useAlerts();

    const handleSubmit = async () => {
        if (rating === 0) {
            showErrorAlert('Por favor, selecciona una calificación.');
            return;
        }

        try {
            const reviewData = {
                orderItemId: item.id,
                rating,
                comment,
                type: item.product_id ? 'product' : 'insumo',
                itemId: item.product_id || item.insumo_id
            };
            await createReview(reviewData);
            showSuccessAlert('¡Gracias por tu reseña!');
            onReviewSubmitted(); // Llama a la función para cerrar y refrescar
        } catch (error) {
            showErrorAlert(error.message);
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content review-modal">
                <h2>Calificar: {item.name}</h2>
                <div className="star-rating">
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => setRating(ratingValue)}
                                />
                                <FaStar
                                    className="star"
                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    size={40}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        );
                    })}
                </div>
                <textarea
                    placeholder="Escribe tu comentario (opcional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={handleSubmit} className="btn-save">Enviar Reseña</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;