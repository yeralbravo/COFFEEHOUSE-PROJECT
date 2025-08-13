import React, { useState, useEffect, useRef } from 'react';
import { FiUploadCloud, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import '../../style/ProductForm.css'; // Ya contiene los estilos necesarios

const ProductForm = ({ onSubmit, productToEdit, onCancel }) => {
    // 1. Quitamos 'caracteristicas' del estado inicial del formulario principal
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
    
    // 2. Añadimos estados separados para las imágenes y las características
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([{ key: '', value: '' }]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (productToEdit) {
            // Llenamos el formulario con los datos del producto a editar
            setFormData({
                nombre: productToEdit.nombre || '',
                tipo: productToEdit.tipo || '',
                marca: productToEdit.marca || '',
                precio: productToEdit.precio || '',
                peso_neto: productToEdit.peso_neto || '',
                stock: productToEdit.stock || '',
                descripcion: productToEdit.descripcion || '',
            });

            // Convertimos el objeto JSON de características en el array que usa el editor
            if (productToEdit.caracteristicas && typeof productToEdit.caracteristicas === 'object') {
                const caracteristicasArray = Object.entries(productToEdit.caracteristicas).map(([key, value]) => ({ key, value }));
                setCaracteristicas(caracteristicasArray.length > 0 ? caracteristicasArray : [{ key: '', value: '' }]);
            }

            // Mostramos las imágenes existentes
            if (productToEdit.images && productToEdit.images.length > 0) {
                setImagePreviews(productToEdit.images.map(imgUrl => `http://localhost:5000/${imgUrl}`));
            }
        } else {
            // Reseteamos todo para un formulario nuevo
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
    
    // --- MANEJADORES PARA CARACTERÍSTICAS DINÁMICAS ---
    const handleCaracteristicaChange = (index, field, value) => {
        const newCaracteristicas = [...caracteristicas];
        newCaracteristicas[index][field] = value;
        setCaracteristicas(newCaracteristicas);
    };

    const addCaracteristica = () => {
        setCaracteristicas([...caracteristicas, { key: '', value: '' }]);
    };

    const removeCaracteristica = (index) => {
        const newCaracteristicas = caracteristicas.filter((_, i) => i !== index);
        setCaracteristicas(newCaracteristicas);
    };
    
    // --- MANEJADORES PARA IMÁGENES ---
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (imageFiles.length + files.length > 5) {
            alert("No puedes subir más de 5 imágenes.");
            return;
        }
        setImageFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre del producto es obligatorio.';
        if (!formData.tipo.trim()) newErrors.tipo = 'El tipo de café es obligatorio.';
        if (!formData.precio) newErrors.precio = 'El precio es obligatorio.';
        if (formData.stock === '' || formData.stock === null) newErrors.stock = 'El stock es obligatorio.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Convertimos el array de características de vuelta a un objeto JSON
        const caracteristicasObject = caracteristicas.reduce((acc, curr) => {
            if (curr.key.trim()) { // Solo añadimos si la clave no está vacía
                acc[curr.key.trim()] = curr.value.trim();
            }
            return acc;
        }, {});

        const finalFormData = new FormData();
        Object.keys(formData).forEach(key => finalFormData.append(key, formData[key]));
        
        // Añadimos el objeto de características como un string JSON
        if (Object.keys(caracteristicasObject).length > 0) {
            finalFormData.append('caracteristicas', JSON.stringify(caracteristicasObject));
        }

        imageFiles.forEach(file => {
            finalFormData.append('product_images', file);
        });
        
        // Enviamos los datos (el componente padre decidirá si es para crear o editar)
        onSubmit(finalFormData);
    };

    return (
        <form onSubmit={handleSubmit} className="product-form-container" noValidate>
            <div className="form-group">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={errors.nombre ? 'input-error' : ''} />
                {errors.nombre && <p className="error-text">{errors.nombre}</p>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tipo">Tipo de Café</label>
                    <input id="tipo" type="text" name="tipo" placeholder="Ej: Grano Tostado, Molido Fino..." value={formData.tipo} onChange={handleChange} className={errors.tipo ? 'input-error' : ''} />
                    {errors.tipo && <p className="error-text">{errors.tipo}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="marca">Marca</label>
                    <input id="marca" type="text" name="marca" value={formData.marca} onChange={handleChange} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="precio">Precio (COP)</label>
                    <input id="precio" type="number" name="precio" step="100" value={formData.precio} onChange={handleChange} className={errors.precio ? 'input-error' : ''} />
                    {errors.precio && <p className="error-text">{errors.precio}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="peso_neto">Peso Neto (gramos)</label>
                    <input id="peso_neto" type="number" name="peso_neto" placeholder="Ej: 250" value={formData.peso_neto} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock (Unidades)</label>
                    <input id="stock" type="number" name="stock" value={formData.stock} onChange={handleChange} className={errors.stock ? 'input-error' : ''} />
                    {errors.stock && <p className="error-text">{errors.stock}</p>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="descripcion">Descripción Detallada</label>
                <textarea id="descripcion" name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange} />
            </div>

            {/* --- vvv EDITOR DE CARACTERÍSTICAS DINÁMICO vvv --- */}
            <div className="form-group">
                <label>Características</label>
                <div className="caracteristicas-editor">
                    {caracteristicas.map((item, index) => (
                        <div key={index} className="caracteristica-item">
                            <input
                                type="text"
                                placeholder="Característica (ej: Aroma)"
                                value={item.key}
                                onChange={(e) => handleCaracteristicaChange(index, 'key', e.target.value)}
                                className="caracteristica-input key"
                            />
                            <input
                                type="text"
                                placeholder="Valor (ej: Intenso a chocolate)"
                                value={item.value}
                                onChange={(e) => handleCaracteristicaChange(index, 'value', e.target.value)}
                                className="caracteristica-input value"
                            />
                            <button type="button" onClick={() => removeCaracteristica(index)} className="btn-remove-caracteristica">
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addCaracteristica} className="btn-add-caracteristica">
                        <FiPlus /> Añadir Característica
                    </button>
                </div>
            </div>

            {/* --- vvv CARGADOR DE IMÁGENES vvv --- */}
            <div className="form-group">
                <label>Imágenes del Producto (hasta 5)</label>
                <input type="file" ref={fileInputRef} multiple accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
                <div className="image-uploader" onClick={() => fileInputRef.current.click()}>
                    <FiUploadCloud size={30} />
                    <p>Haz clic o arrastra tus imágenes aquí</p>
                    <span>JPG, PNG, WEBP. Máx 5MB</span>
                </div>
                {imagePreviews.length > 0 && (
                    <div className="image-preview-container">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={preview} alt={`Vista previa ${index + 1}`} />
                                <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                                    <FiX size={14} />
                                </button>
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