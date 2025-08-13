import React from 'react';
// --- CORRECCIÓN AQUÍ: Se importan los íconos de sus librerías correctas ---
import { FaStar } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import '../../style/AllReviewsModal.css';

const AllReviewsModal = ({ reviews, onClose }) => {
    return (
        <div className="modal-overlay-reviews" onClick={onClose}>
            <div className="modal-content-reviews" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-reviews">
                    <h2>Todas las Opiniones ({reviews.length})</h2>
                    <button onClick={onClose} className="close-button-reviews">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="modal-body-reviews">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className="review-item-modal">
                                <div className="review-author-rating">
                                    <strong>{review.nombre} {review.apellido.charAt(0)}.</strong>
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} color={i < review.rating ? "#ffc107" : "#e4e5e9"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="review-text-modal">"{review.comment}"</p>
                                <p className="review-date-modal">{new Date(review.created_at).toLocaleDateString('es-CO')}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay reseñas para mostrar.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllReviewsModal;