import React from 'react';
import '../../style/ProductSpecs.css';

const ProductSpecs = ({ specs }) => {
    return (
        <div className="specs-grid">
            {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="spec-item">
                    <p className="spec-key">{key}</p>
                    <p className="spec-value">{value}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductSpecs;