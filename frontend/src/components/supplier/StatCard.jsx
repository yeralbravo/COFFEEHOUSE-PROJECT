import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import '../../style/StatCard.css';

const StatCard = ({ icon, title, value, link, linkText }) => {
    return (
        <div className="stat-card-container">
            <div className="stat-card-header">
                <div className="stat-card-icon">{icon}</div>
                <p className="stat-card-title">{title}</p>
            </div>
            <p className="stat-card-value">{value}</p>
            
            {/* El enlace y la flecha ahora solo aparecen si 'link' y 'linkText' existen */}
            {link && linkText && (
                <Link to={link} className="stat-card-link">
                    {linkText} <FiArrowRight />
                </Link>
            )}
        </div>
    );
};

export default StatCard;