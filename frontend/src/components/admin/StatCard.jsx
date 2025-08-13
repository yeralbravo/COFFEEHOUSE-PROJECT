import React from 'react';
import '../../style/AdminStatsPages.css'; // Usaremos el mismo estilo

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <p>{title}</p>
                <h3>{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;