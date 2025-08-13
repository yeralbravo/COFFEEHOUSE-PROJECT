import React, { useState, useEffect } from 'react';
import '../../style/ImageGallery.css';

const ImageGallery = ({ images }) => {
    // Se inicializa el estado a null para evitar renderizar una imagen con src=""
    const [mainImage, setMainImage] = useState(null);
    const API_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        // Se establece la imagen principal solo cuando las imágenes están disponibles
        if (images && images.length > 0 && images[0]) {
            setMainImage(`${API_BASE_URL}/${images[0]}`);
        } else {
            // Si no hay imágenes, se usa una imagen de marcador de posición
            setMainImage('https://placehold.co/600x600/EFEFEF/8B8B8B?text=Sin+Imagen');
        }
    }, [images]);

    return (
        <div className="image-gallery-redesign">
            <div className="thumbnail-list">
                {images && images.map((img, index) => (
                    // Se añade una comprobación para saltar imágenes nulas o vacías en el array
                    img && (
                        <div
                            key={index}
                            className={`thumbnail-wrapper ${mainImage && mainImage.includes(img) ? 'active' : ''}`}
                            onClick={() => setMainImage(`${API_BASE_URL}/${img}`)}
                        >
                            <img src={`${API_BASE_URL}/${img}`} alt={`Vista previa ${index + 1}`} className="thumbnail-image"/>
                        </div>
                    )
                ))}
            </div>
             <div className="main-image-wrapper">
                {/* Solo se renderiza la etiqueta <img> si 'mainImage' tiene una URL válida */}
                {mainImage && <img src={mainImage} alt="Vista principal del producto" className="main-image"/>}
            </div>
        </div>
    );
};

// Esta es la línea clave que soluciona el error de exportación
export default ImageGallery;