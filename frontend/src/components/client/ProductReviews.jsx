import React, { useState, useEffect } from 'react';
import { getReviews } from '../../services/reviewService';
import { FaStar } from 'react-icons/fa';
import AllReviewsModal from './AllReviewsModal';
import '../../style/ProductReviews.css';

const ProductReviews = ({ type, itemId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!itemId) return;
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await getReviews(type, itemId);
                if (response.success) {
                    setReviews(response.data);
                }
            } catch (error) {
                console.error("Error al cargar reseñas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [type, itemId]);

    const calculateSummary = () => {
        if (reviews.length === 0) {
            return { average: 0, total: 0, distribution: [] };
        }
        const total = reviews.length;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = (sum / total).toFixed(1);
        const distribution = [5, 4, 3, 2, 1].map(stars => ({
            stars,
            count: reviews.filter(r => r.rating === stars).length
        }));
        return { average, total, distribution };
    };

    const summary = calculateSummary();

    if (loading) {
        return <p>Cargando opiniones...</p>;
    }

    return (
        <>
            <h3>Opiniones</h3>
            <div className="section-content reviews-wrapper">
                <div className="reviews-container">
                    <div className="reviews-summary">
                        {summary.total > 0 ? (
                            <>
                                <p className="summary-average">{summary.average}</p>
                                <div className="summary-stars">
                                   <FaStar color="#ffc107" /> <span>({summary.total} calificaciones)</span>
                                </div>
                                <div className="ratings-distribution">
                                    {summary.distribution.map(item => (
                                        <div key={item.stars} className="rating-bar-item">
                                            <span>{item.stars}</span>
                                            <div className="rating-bar">
                                                <div className="rating-bar-filled" style={{ width: `${(item.count / summary.total) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p>Aún no hay reseñas para este producto.</p>
                        )}
                    </div>
                    <div className="reviews-list">
                        {reviews.slice(0, 3).map((review, index) => (
                            <div key={index} className="review-comment">
                                <div className="review-author-rating">
                                    <strong>{review.nombre} {review.apellido.charAt(0)}.</strong>
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} color={i < review.rating ? "#ffc107" : "#e4e5e9"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="review-text">"{review.comment}"</p>
                                <p className="review-date">{new Date(review.created_at).toLocaleDateString('es-CO')}</p>
                            </div>
                        ))}
                        {reviews.length > 3 && (
                            <button className="see-more-btn" onClick={() => setIsModalOpen(true)}>
                                Ver las {reviews.length} opiniones
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <AllReviewsModal 
                    reviews={reviews} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
};

export default ProductReviews;