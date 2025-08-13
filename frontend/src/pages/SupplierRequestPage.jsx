// eslint-disable-next-line no-unused-vars
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlerts } from '../hooks/useAlerts';
import { validateField } from '../services/supplierRequestService';
import axios from 'axios';
import '../style/SupplierRequestPage.css';
import logo from '../assets/logo.png';

const SupplierRequestPage = () => {
    const navigate = useNavigate();
    const { showSuccessAlert, showErrorAlert } = useAlerts();
    const [formData, setFormData] = useState({
        company_name: '', nit: '', contact_person: '', email: '',
        phone: '', address: '', city: '', product_types: '', message: ''
    });
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // --- LÓGICA DE VALIDACIÓN MEJORADA ---
    const validateForm = async () => {
        const errors = {};
        
        // 1. Validaciones de campos vacíos
        if (!formData.nit) errors.nit = "El NIT es obligatorio.";
        if (!formData.email) errors.email = "El correo es obligatorio.";
        if (!formData.phone) errors.phone = "El teléfono es obligatorio.";
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false;
        }

        // 2. Validaciones asíncronas contra la base de datos
        try {
            const [nitValidation, emailValidation, phoneValidation] = await Promise.all([
                validateField('nit', formData.nit),
                validateField('email', formData.email),
                validateField('phone', formData.phone)
            ]);

            if (nitValidation.isTaken) errors.nit = nitValidation.message;
            if (emailValidation.isTaken) errors.email = emailValidation.message;
            if (phoneValidation.isTaken) errors.phone = phoneValidation.message;

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                return false;
            }

            return true; // Si todo está bien
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            showErrorAlert('No se pudo validar la información. Inténtalo de nuevo.');
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isValid = await validateForm();
        
        if (isValid) {
            try {
                const response = await axios.post('http://localhost:5000/api/supplier-requests', formData);
                showSuccessAlert(response.data.message);
                navigate('/');
            } catch (error) {
                showErrorAlert(error.response?.data?.error || 'Ocurrió un error al enviar la solicitud.');
            }
        }
        
        setLoading(false);
    };

    return (
        <div className="supplier-request-wrapper">
            <nav className='auth-nav'>
                <Link to="/" className="logo-link">
                    <div className="logo-section">
                        <img src={logo} alt="Coffee House" className="logo-img" />
                        <h2>COFFEE HOUSE</h2>
                    </div>
                </Link>
            </nav>
            <main className='supplier-request-main'>
                <div className='form-container-supplier'>
                    <form onSubmit={handleSubmit} className="supplier-box" noValidate>
                        <h2>Registro de proveedor</h2>
                        <p className="form-description">
                            Apreciado proveedor/a, cuando se haya enviado el formulario, nuestro equipo validará la información y una vez aprobada, se le enviará su usuario y contraseña al correo suministrado en el registro.
                        </p>

                        <fieldset className="form-fieldset">
                            <legend className="fieldset-legend">Datos de la Empresa</legend>
                            <input type="text" name="company_name" placeholder="Nombre de la empresa / persona *" value={formData.company_name} onChange={handleChange} required />
                            <div>
                                <input type="text" name="nit" placeholder="NIT *" value={formData.nit} onChange={handleChange} required />
                                {validationErrors.nit && <p className="validation-error-text">{validationErrors.nit}</p>}
                            </div>
                        </fieldset>

                        <fieldset className="form-fieldset">
                            <legend className="fieldset-legend">Datos de Contacto</legend>
                            <input type="text" name="contact_person" placeholder="Nombre de la persona de contacto *" value={formData.contact_person} onChange={handleChange} required />
                            <div>
                                <input type="email" name="email" placeholder="Correo electrónico *" value={formData.email} onChange={handleChange} required />
                                {validationErrors.email && <p className="validation-error-text">{validationErrors.email}</p>}
                            </div>
                            <div>
                                <input type="tel" name="phone" placeholder="Teléfono *" value={formData.phone} onChange={handleChange} required />
                                {validationErrors.phone && <p className="validation-error-text">{validationErrors.phone}</p>}
                            </div>
                        </fieldset>
                        
                        <fieldset className="form-fieldset">
                            <legend className="fieldset-legend">Información Adicional</legend>
                            <input type="text" name="product_types" placeholder="¿Qué tipo de productos ofreces? *" value={formData.product_types} onChange={handleChange} required />
                            <input type="text" name="address" placeholder="Dirección (Opcional)" value={formData.address} onChange={handleChange} />
                            <input type="text" name="city" placeholder="Ciudad (Opcional)" value={formData.city} onChange={handleChange} />
                            <textarea name="message" placeholder="Déjanos un mensaje... (Opcional)" value={formData.message} onChange={handleChange} rows="3"></textarea>
                        </fieldset>

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Validando y enviando...' : 'ENVIAR SOLICITUD'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SupplierRequestPage;