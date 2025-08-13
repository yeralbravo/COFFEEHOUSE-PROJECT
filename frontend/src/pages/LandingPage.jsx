import React, { useState, useEffect } from 'react'; // <-- LA LÍNEA IMPORTANTE ES ESTA
import { Link, useNavigate } from 'react-router-dom';
import { useAlerts } from '../hooks/useAlerts';
import { sendContactMessage } from '../services/contactService';
import axios from 'axios';
import '../style/LandingPage.css';
import logo from '../assets/logo.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const { showSuccessAlert, showErrorAlert } = useAlerts();
    const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '', privacy: false });
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/catalog/landing-products');
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error("Error al cargar productos para la landing page:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleRedirectToRegister = () => {
        navigate('/register');
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setContactForm({ ...contactForm, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!contactForm.privacy) {
            showErrorAlert('Debes aceptar las políticas de privacidad.');
            return;
        }
        try {
            // eslint-disable-next-line no-unused-vars
            const { privacy, ...formData } = contactForm;
            const response = await sendContactMessage(formData);
            showSuccessAlert(response.message);
            setContactForm({ name: '', phone: '', email: '', message: '', privacy: false });
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="top-header">
        <div className="brand-logo">
          <img src={logo} alt="Coffee House Logo" className="logo-image" />
          <h1 className="brand-name">COFFEE HOUSE</h1>
        </div>
        <nav className="navigation-menu">
          <a href="#about-us" className="menu-item">Nosotros</a>
          <a href="#our-products" className="menu-item">Productos</a>
          <a href="#suppliers" className="menu-item">Proveedores</a>
          <a href="#contact-info" className="menu-item">Contacto</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-banner">
        <div className="banner-content">
          <h2 className="banner-heading">El mejor café, directamente en tu hogar</h2>
          <p className="banner-text">Explora nuestra selección de cafés premium y disfruta de entregas rápidas.</p>
          <div className="banner-actions">
            <Link to="/login" className="action-button login-action">Iniciar Sesión</Link>
            <Link to="/register" className="action-button register-action">Registrarse</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="feature-zone" id="about-us">
        <div className="feature-block">
          <span className="feature-symbol">☕</span>
          <h3 className="feature-title">Cafés especiales</h3>
          <p className="feature-detail">Lorem ipsum dolor sit, amet consectetur adipiscing elit. Velit, nemo officiis iste amet</p>
        </div>
        <div className="feature-block">
          <span className="feature-symbol">📦</span>
          <h3 className="feature-title">Equipo de calidad</h3>
          <p className="feature-detail">Lorem ipsum dolor sit, amet consectetur adipiscing elit. Velit, nemo officiis iste amet</p>
        </div>
        <div className="feature-block">
          <span className="feature-symbol">🚚</span>
          <h3 className="feature-title">Entregas rápidas</h3>
          <p className="feature-detail">Lorem ipsum dolor sit, amet consectetur adipiscing elit. Velit, nemo officiis iste amet</p>
        </div>
        <div className="feature-block">
          <span className="feature-symbol">💳</span>
          <h3 className="feature-title">Pagos seguros</h3>
          <p className="feature-detail">Lorem ipsum dolor sit, amet consectetur adipiscing elit. Velit, nemo officiis iste amet</p>
        </div>
      </section>

      {/* Productos Section */}
      <section className="product-showcase" id="our-products">
        <h2 className="product-heading">Descubre nuestros productos</h2>
        <div className="product-layout">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            products.map(product => (
              <div className="product-item" key={`${product.item_type}-${product.id}`}>
                <img 
                  src={product.images.length > 0 ? `http://localhost:5000/${product.images[0]}` : 'https://placehold.co/200x200/EFEFEF/8B8B8B?text=Sin+Imagen'} 
                  alt={product.nombre} 
                  className="product-pic" 
                />
                <h3 className="product-label">{product.nombre}</h3>
                <p className="product-info">{product.marca || (product.tipo || product.categoria)}</p>
                <p className="product-cost">${new Intl.NumberFormat('es-CO').format(product.precio)}</p>
                <button className="purchase-button" onClick={handleRedirectToRegister}>Comprar ahora</button>
              </div>
            ))
          )}
          {!loading && products.length === 0 && (
            <p>No hay productos destacados en este momento.</p>
          )}
        </div>
      </section>

      {/* Proveedores Section */}
      <section className="supplier-area" id="suppliers">
        <h2 className="supplier-heading">¿Eres proveedor de cafés especiales?</h2>
        <p className="supplier-text">Únete a nuestra plataforma y llega a más clientes</p>
        <Link to="/supplier-request" className="supplier-btn" style={{ textDecoration: 'none' }}>FORMULARIO PROVEEDOR</Link>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact-info">
        <form className="supplier-form" onSubmit={handleFormSubmit}>
          <p className="contact-header">Contáctanos</p>
          <p className="contact-details">Su opinión es muy importante para nosotros, contáctanos y te responderemos a la brevedad</p>
          <input type="text" name="name" className="form-input" placeholder="Nombre" value={contactForm.name} onChange={handleFormChange} required />
          <input type="text" name="phone" className="form-input" placeholder="Teléfono" value={contactForm.phone} onChange={handleFormChange} required />
          <input type="email" name="email" className="form-input" placeholder="Correo" value={contactForm.email} onChange={handleFormChange} required />
          <textarea name="message" className="form-textarea" placeholder="Mensaje" value={contactForm.message} onChange={handleFormChange} required></textarea>
          <label className="form-label">
            <input type="checkbox" name="privacy" className="form-checkbox" checked={contactForm.privacy} onChange={handleFormChange} required /> Acepto las políticas de privacidad y soy mayor de edad
          </label>
          <button type="submit" className="submit-action">ENVIAR</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-section">
          <h3 className="footer-brand">COFFEE HOUSE</h3>
          <div className="footer-nav">
            <a href="#about-us" className="footer-link">Nosotros</a>
            <a href="#our-products" className="footer-link">Productos</a>
            <a href="#suppliers" className="footer-link">Proveedores</a>
            <a href="#contact-info" className="footer-link">Contacto</a>
          </div>
          <div className="social-networks">
            <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <p className="copyright-notice">© 2025 Coffee House. Todos los derechos reservados.</p>
        <p className="platform-info">Plataforma por HomeClient</p>
      </footer>
    </div>
  );
};

export default LandingPage;