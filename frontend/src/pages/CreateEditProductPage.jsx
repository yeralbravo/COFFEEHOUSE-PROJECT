import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAlerts } from '../hooks/useAlerts';
import * as productService from '../services/productService';
import '../style/CreateEditProductPage.css';

const CreateEditProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(productId);
    const { showSuccessAlert, showErrorAlert } = useAlerts();

    const initialState = {
        nombre: '', tipo: '', marca: '', precio: '', peso_neto: '', stock: '', descripcion: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([{ key: '', value: '' }]);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const formatPrice = (value) => {
        if (!value) return '';
        const numericValue = value.toString().replace(/[^0-9]/g, '');
        if (numericValue === '') return '';
        return new Intl.NumberFormat('es-CO').format(numericValue);
    };

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            productService.getProductById(productId)
                .then(res => {
                    const product = res.data;
                    setFormData({
                        nombre: product.nombre || '',
                        tipo: product.tipo || '',
                        marca: product.marca || '',
                        precio: formatPrice(product.precio) || '',
                        peso_neto: product.peso_neto ?? '',
                        stock: product.stock ?? '',
                        descripcion: product.descripcion || '',
                    });
                    if (product.caracteristicas && typeof product.caracteristicas === 'object') {
                        const caracteristicasArray = Object.entries(product.caracteristicas).map(([key, value]) => ({ key, value }));
                         if (caracteristicasArray.length > 0) setCaracteristicas(caracteristicasArray);
                    }
                    if (product.images) {
                        setImagePreviews(product.images.map(img => `http://localhost:5000/${img}`));
                    }
                })
                .catch(err => showErrorAlert(err.message))
                .finally(() => setLoading(false));
        }
    }, [productId, isEditing, showErrorAlert]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'precio') {
            setFormData({ ...formData, [name]: formatPrice(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (imageFiles.length + files.length > 4) {
            showErrorAlert('Puedes subir un máximo de 4 imágenes.');
            return;
        }
        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleCaracteristicaChange = (index, field, value) => {
        const newCaracteristicas = [...caracteristicas];
        newCaracteristicas[index][field] = value;
        setCaracteristicas(newCaracteristicas);
    };

    const addCaracteristica = () => setCaracteristicas([...caracteristicas, { key: '', value: '' }]);
    const removeCaracteristica = (index) => setCaracteristicas(caracteristicas.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const finalFormData = new FormData();
        const dataToSend = { ...formData };

        if (dataToSend.precio) {
            dataToSend.precio = dataToSend.precio.replace(/\./g, '');
        }

        Object.entries(dataToSend).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                finalFormData.append(key, value);
            }
        });
        
        const caracteristicasObj = caracteristicas.reduce((acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
        }, {});
        finalFormData.append('caracteristicas', JSON.stringify(caracteristicasObj));

        imageFiles.forEach(file => finalFormData.append('product_images', file));

        try {
            if (isEditing) {
                await productService.updateProduct(productId, finalFormData);
                showSuccessAlert('Producto actualizado con éxito.');
            } else {
                await productService.createProduct(finalFormData);
                showSuccessAlert('Producto creado con éxito.');
            }
            navigate('/supplier/products');
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    if (loading) return <p>Cargando producto...</p>;

    return (
        <div className="add-edit-product-page">
            <h1>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h1>
            <form onSubmit={handleSubmit} className="product-form-layout">
                <div className="form-section image-section">
                    <h3>Imágenes del Producto</h3>
                    <div className="image-uploader" onClick={() => fileInputRef.current.click()}>
                        <FiUploadCloud size={30} />
                        <p>Haz clic para agregar imágenes</p>
                        <span>Máximo 4 archivos</span>
                    </div>
                    <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <div className="image-preview-grid">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={preview} alt={`Vista previa ${index + 1}`} />
                                <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}><FiX /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section details-section">
                    <h3>Detalles del Producto</h3>
                    <div className="form-grid">
                        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del producto *" required />
                        <input name="marca" value={formData.marca} onChange={handleChange} placeholder="Marca *" required />
                        <input name="tipo" value={formData.tipo} onChange={handleChange} placeholder="Tipo de café (ej. Grano, Molido) *" required />
                        
                        <input 
                            name="precio" 
                            type="text"
                            inputMode="numeric"
                            value={formData.precio} 
                            onChange={handleChange} 
                            placeholder="Precio *" 
                            required 
                        />

                        <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Cantidad de stock *" required />
                        <input name="peso_neto" type="number" value={formData.peso_neto} onChange={handleChange} placeholder="Peso neto en gramos" />
                    </div>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción del producto *" required />

                    <h3>Características Adicionales</h3>
                    <div className="caracteristicas-container">
                        {caracteristicas.map((item, index) => (
                            <div key={index} className="caracteristica-item">
                                <input className="key" value={item.key} onChange={(e) => handleCaracteristicaChange(index, 'key', e.target.value)} placeholder="Característica (ej. Origen)" />
                                <input className="value" value={item.value} onChange={(e) => handleCaracteristicaChange(index, 'value', e.target.value)} placeholder="Valor (ej. Colombia)" />
                                <button type="button" onClick={() => removeCaracteristica(index)}><FiTrash2 /></button>
                            </div>
                        ))}
                        <button type="button" className="btn-add-feature" onClick={addCaracteristica}>
                            <FiPlus /> Agregar característica
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/supplier/products')}>Cancelar</button>
                    <button type="submit" className="btn-save">Guardar Producto</button>
                </div>
            </form>
        </div>
    );
};

export default CreateEditProductPage;