import React, { useState, useEffect, useRef } from 'react';
import { FiUploadCloud, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import '../../style/ProductForm.css';

const ProductForm = ({ onSubmit, productToEdit, onCancel }) => {
    const initialState = {
        nombre: '',
        tipo: '',
        marca: '',
        precio: '',
        peso_neto: '',
        stock: '',
        descripcion: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([{ key: '', value: '' }]);
    const fileInputRef = useRef(null);

    // ================== PASO 1: CORRECCIÓN AL CARGAR EL FORMULARIO ==================
    useEffect(() => {
        if (productToEdit) {
            // Corregimos el precio dividiéndolo por 100 para mostrar el valor real.
            const displayPrice = productToEdit.precio ? (parseFloat(productToEdit.precio) / 100) : '';

            setFormData({
                nombre: productToEdit.nombre || '',
                tipo: productToEdit.tipo || '',
                marca: productToEdit.marca || '',
                precio: displayPrice, // Usamos el precio corregido
                peso_neto: productToEdit.peso_neto || '',
                stock: productToEdit.stock || '',
                descripcion: productToEdit.descripcion || '',
            });

            if (productToEdit.caracteristicas && typeof productToEdit.caracteristicas === 'object') {
                const caracteristicasArray = Object.entries(productToEdit.caracteristicas).map(([key, value]) => ({ key, value }));
                setCaracteristicas(caracteristicasArray.length > 0 ? caracteristicasArray : [{ key: '', value: '' }]);
            }
            if (productToEdit.images && productToEdit.images.length > 0) {
                setImagePreviews(productToEdit.images.map(imgUrl => `http://localhost:5000/${imgUrl}`));
            }
        } else {
            setFormData(initialState);
            setCaracteristicas([{ key: '', value: '' }]);
            setImageFiles([]);
            setImagePreviews([]);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    // ================== PASO 2: CORRECCIÓN AL GUARDAR EL FORMULARIO ==================
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const finalFormData = new FormData();
        const dataToSend = { ...formData };

        // --- ¡IMPORTANTE! ---
        // Al guardar, multiplicamos el precio por 100 para que coincida
        // con el formato que el resto de tu aplicación parece usar (ej: $350 se guarda como 35000).
        if (dataToSend.precio) {
            dataToSend.precio = Math.round(parseFloat(dataToSend.precio) * 100);
        }

        Object.keys(dataToSend).forEach(key => {
            const value = dataToSend[key];
            if (value !== null && value !== '') {
                finalFormData.append(key, value);
            }
        });
        
        const caracteristicasObject = caracteristicas.reduce((acc, curr) => {
            if (curr.key.trim()) { acc[curr.key.trim()] = curr.value.trim(); }
            return acc;
        }, {});
        if (Object.keys(caracteristicasObject).length > 0) {
            finalFormData.append('caracteristicas', JSON.stringify(caracteristicasObject));
        }
        imageFiles.forEach(file => {
            finalFormData.append('product_images', file);
        });
        
        onSubmit(finalFormData);
    };

    const validateForm = () => { /* ... */ return true; };
    const handleCaracteristicaChange = (index, field, value) => { /* ... */ };
    const addCaracteristica = () => { /* ... */ };
    const removeCaracteristica = (index) => { /* ... */ };
    const handleImageChange = (e) => { /* ... */ };
    const removeImage = (index) => { /* ... */ };

    return (
        <form onSubmit={handleSubmit} className="product-form-container" noValidate>
            <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tipo">Tipo de Café</label>
                    <input id="tipo" type="text" name="tipo" placeholder="Ej: Grano Tostado, Molido Fino..." value={formData.tipo} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="marca">Marca</label>
                    <input id="marca" type="text" name="marca" value={formData.marca} onChange={handleChange} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="precio">Precio (COP)</label>
                    <input id="precio" type="number" name="precio" step="100" value={formData.precio} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="peso_neto">Peso Neto (gramos)</label>
                    <input id="peso_neto" type="number" name="peso_neto" placeholder="Ej: 250" value={formData.peso_neto} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock (Unidades)</label>
                    <input id="stock" type="number" name="stock" value={formData.stock} onChange={handleChange} />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="descripcion">Descripción Detallada</label>
                <textarea id="descripcion" name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Características</label>
                <div className="caracteristicas-editor">
                    {caracteristicas.map((item, index) => (
                        <div key={index} className="caracteristica-item">
                            <input type="text" placeholder="Característica (ej: Aroma)" value={item.key} onChange={(e) => handleCaracteristicaChange(index, 'key', e.target.value)} className="caracteristica-input key" />
                            <input type="text" placeholder="Valor (ej: Intenso a chocolate)" value={item.value} onChange={(e) => handleCaracteristicaChange(index, 'value', e.target.value)} className="caracteristica-input value" />
                            <button type="button" onClick={() => removeCaracteristica(index)} className="btn-remove-caracteristica"><FiTrash2 /></button>
                        </div>
                    ))}
                    <button type="button" onClick={addCaracteristica} className="btn-add-caracteristica"><FiPlus /> Añadir Característica</button>
                </div>
            </div>
            <div className="form-group">
                <label>Imágenes del Producto</label>
                <input type="file" ref={fileInputRef} multiple accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
                <div className="image-uploader" onClick={() => fileInputRef.current.click()}>
                    <FiUploadCloud size={30} />
                    <p>Haz clic o arrastra tus imágenes aquí</p>
                </div>
                {imagePreviews.length > 0 && (
                    <div className="image-preview-container">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={preview} alt={`Vista previa ${index + 1}`} />
                                <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}><FiX size={14} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="modal-actions">
                <button type="button" onClick={onCancel} className="btn-form-cancel">Cancelar</button>
                <button type="submit" className="btn-form-save">{productToEdit ? 'Guardar Cambios' : 'Crear Producto'}</button>
            </div>
        </form>
    );
};

export default ProductForm;