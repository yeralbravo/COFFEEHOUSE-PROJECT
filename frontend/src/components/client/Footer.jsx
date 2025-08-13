import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../../style/Footer.css';

const Footer = () => {
    return (
        <footer className="client-footer">
            <div className="footer-content">
                <div className="footer-column footer-brand-nav">
                    <h3 className="footer-logo">COFFEE HOUSE</h3>
                    <nav className="footer-nav">
                        <NavLink to="/home">Inicio</NavLink>
                        <NavLink to="/cafe">Café</NavLink>
                        <NavLink to="/insumos">Insumos</NavLink>
                        <NavLink to="/mis-pedidos">Mis pedidos</NavLink>
                    </nav>
                </div>
                <div className="footer-column footer-social">
                    <p>Síguenos</p>
                    <div className="social-icons">
                        <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Coffee House. Todos los derechos reservados.</p>
                <NavLink to="/privacy-policy">Política de privacidad</NavLink>
            </div>
        </footer>
    );
};

export default Footer;