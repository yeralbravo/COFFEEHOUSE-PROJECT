import React, { useState, useEffect } from 'react'; // <-- LA LÍNEA IMPORTANTE ES ESTA
import { Link, useNavigate } from 'react-router-dom';
import { useAlerts } from '../hooks/useAlerts';
import { sendContactMessage } from '../services/contactService';
import axios from 'axios';
import '../style/LandingPage.css';
import logo from '../assets/logo.png';
import { FiCoffee, FiPackage, FiTruck, FiCreditCard } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

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
      <section className="features-section" id="about-us">
        <div className="feature-item">
          <div className="feature-icon"><FiCoffee /></div>
          <h3>Cafés especiales</h3>
          <p>Descubre granos únicos seleccionados de las mejores fincas para una experiencia inolvidable.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FiPackage /></div>
          <h3>Equipo de calidad</h3>
          <p>Encuentra todo lo que necesitas, desde molinillos hasta cafeteras, para preparar el café perfecto.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FiTruck /></div>
          <h3>Entregas rápidas</h3>
          <p>Recibe tu café y equipo directamente en tu puerta con nuestro eficiente servicio de envío.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FiCreditCard /></div>
          <h3>Pagos seguros</h3>
          <p>Compra con total confianza utilizando nuestra plataforma de pagos segura y confiable.</p>
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

      {/* Suppliers Section */}
      <section className="suppliers-section" id="suppliers">
        <h2>¿Eres proveedor de cafés especiales?</h2>
        <p>Únete a nuestra plataforma y llega a más clientes.</p>
        <Link to="/supplier-request" className="btn btn-supplier-form">FORMULARIO PROVEEDOR</Link>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact-info">
        <form className="supplier-form" onSubmit={handleFormSubmit}>
          <h3 className="contact-header">Contáctanos</h3>
          <p className="contact-details">Tú opinión es muy importante para nosotros. Por favor, llene los siguientes datos y nos pondremos en contacto a la brevedad</p>
          
          <div className="form-row">
            <input type="text" name="name" className="form-input" placeholder="Nombre" value={contactForm.name} onChange={handleFormChange} required />
            <input type="text" name="phone" className="form-input" placeholder="Teléfono" value={contactForm.phone} onChange={handleFormChange} required />
          </div>
          
          <input type="email" name="email" className="form-input" placeholder="Correo" value={contactForm.email} onChange={handleFormChange} required />
          <textarea name="message" className="form-textarea" placeholder="Mensaje" value={contactForm.message} onChange={handleFormChange} required></textarea>
          
          {/* --- ESTRUCTURA DEL LABEL MODIFICADA --- */}
          <label className="form-label">
            <input type="checkbox" name="privacy" className="form-checkbox" checked={contactForm.privacy} onChange={handleFormChange} required />
            Acepto las&nbsp;
            <Link to="/politicas-de-privacidad" className="privacy-link">
              políticas de privacidad
            </Link>
          </label>
          <button type="submit" className="submit-action">ENVIAR</button>
        </form>
      </section>

      {/* --- FOOTER COMPLETAMENTE REDISEÑADO --- */}
            <footer className="site-footer">
        <div className="footer-content">
            <div className="footer-column">
                <h3 className="footer-brand">COFFEE HOUSE</h3>
                <nav className="footer-nav">
                    <a href="#about-us">Inicio</a>
                    <a href="#about-us">Nosotros</a>
                    <a href="#our-products">Productos</a>
                    <a href="#suppliers">Proveedores</a>
                    <a href="#contact-info">Contacto</a>
                </nav>
            </div>
            <div className="footer-column footer-column-social">
                <h4 className="footer-column-title">Síguenos</h4>
                <div className="social-networks">
                    <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p className="copyright-notice">© 2025 Coffee House. Todos los derechos reservados.</p>
            <Link to="/politicas-de-privacidad" className="footer-link">Política de privacidad</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;