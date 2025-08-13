import React, { useState, useEffect } from 'react';
import '../../style/HeroSlider.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// --- IMÁGENES NUEVAS Y VERIFICADAS ---
const slides = [
    { 
        image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=1974&auto=format&fit=crop',
        alt: 'Café siendo vertido en una taza desde una cafetera de cristal'
    },
    { 
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop',
        alt: 'Una persona moliendo granos de café con un molinillo manual'
    },
    { 
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop',
        alt: 'Varias tazas con diferentes tipos de café como espresso y capuchino'
    },
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    // Auto-scroll
    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [current]);

    return (
        <div className="hero-slider">
            <div className="slider-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div 
                        className="slide" 
                        key={index} 
                        style={{ backgroundImage: `url(${slide.image})` }}
                        role="img"
                        aria-label={slide.alt}
                    ></div>
                ))}
            </div>
            <button className="slider-arrow prev" onClick={prevSlide} aria-label="Diapositiva anterior"><FiChevronLeft /></button>
            <button className="slider-arrow next" onClick={nextSlide} aria-label="Siguiente diapositiva"><FiChevronRight /></button>
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <div 
                        key={index} 
                        className={`dot ${current === index ? 'active' : ''}`} 
                        onClick={() => setCurrent(index)}
                        aria-label={`Ir a la diapositiva ${index + 1}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
