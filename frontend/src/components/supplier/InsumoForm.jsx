import React, { useState, useEffect, useRef } from 'react';
import { FiUploadCloud, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import '../../style/ProductForm.css'; // Reutilizamos los mismos estilos

const InsumoForm = ({ onSubmit, onCancel, insumoToEdit }) => {
    const initialState = {
        nombre: '',
        categoria: 'Métodos de preparación',
        marca: '',
        precio: '',
        stock: '',
        descripcion: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);
    const [caracteristicas, setCaracteristicas] = useState([{ key: '', value: '' }]);

    useEffect(() => {
        if (insumoToEdit) {
            setFormData({
                nombre: insumoToEdit.nombre || '',
                categoria: insumoToEdit.categoria || 'Métodos de preparación',
                marca: insumoToEdit.marca || '',
                precio: insumoToEdit.precio || '',
                stock: insumoToEdit.stock || '',
                descripcion: insumoToEdit.descripcion || '',
            });

            if (insumoToEdit.caracteristicas && typeof insumoToEdit.caracteristicas === 'object') {
                const caracteristicasArray = Object.entries(insumoToEdit.caracteristicas).map(([key, value]) => ({ key, value }));
                setCaracteristicas(caracteristicasArray.length > 0 ? caracteristicasArray : [{ key: '', value: '' }]);
            }

            if (insumoToEdit.images && insumoToEdit.images.length > 0) {
                setImagePreviews(insumoToEdit.images.map(imgUrl => `http://localhost:5000/${imgUrl}`));
            }
        } else {
            setFormData(initialState);
            setCaracteristicas([{ key: '', value: '' }]);
            setImageFiles([]);
            setImagePreviews([]);
        }
    }, [insumoToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

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
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
        if (!formData.categoria.trim()) newErrors.categoria = 'La categoría es obligatoria.';
        if (!formData.precio) newErrors.precio = 'El precio es obligatorio.';
        if (formData.precio && parseFloat(formData.precio) <= 0) newErrors.precio = 'El precio debe ser positivo.';
        if (formData.stock === '' || formData.stock === null) newErrors.stock = 'El stock es obligatorio.';
        if (formData.stock && parseInt(formData.stock) < 0) newErrors.stock = 'El stock no puede ser negativo.';
        if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const caracteristicasObject = caracteristicas.reduce((acc, curr) => {
            if (curr.key.trim()) {
                acc[curr.key.trim()] = curr.value.trim();
            }
            return acc;
        }, {});

        const finalFormData = new FormData();
        Object.keys(formData).forEach(key => finalFormData.append(key, formData[key]));

        if (Object.keys(caracteristicasObject).length > 0) {
            finalFormData.append('caracteristicas', JSON.stringify(caracteristicasObject));
        }

        imageFiles.forEach(file => {
            finalFormData.append('product_images', file);
        });

        if (insumoToEdit) {
            onSubmit(finalFormData, insumoToEdit.id);
        } else {
            onSubmit(finalFormData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form-container" noValidate>
            <div className="form-group">
                <label htmlFor="nombre">Nombre del Insumo</label>
                <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={errors.nombre ? 'input-error' : ''} />
                {errors.nombre && <p className="error-text">{errors.nombre}</p>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="categoria">Categoría</label>
                    <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className={errors.categoria ? 'input-error' : ''}>
                        <option>Métodos de preparación</option>
                        <option>Molinillos</option>
                        <option>Tazas y Vasos</option>
                        <option>Accesorios</option>
                        <option>Kits</option>
                    </select>
                    {errors.categoria && <p className="error-text">{errors.categoria}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="marca">Marca</label>
                    <input id="marca" type="text" name="marca" value={formData.marca} onChange={handleChange} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="precio">Precio (COP)</label>
                    <input id="precio" type="number" name="precio" value={formData.precio} onChange={handleChange} className={errors.precio ? 'input-error' : ''} />
                    {errors.precio && <p className="error-text">{errors.precio}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock (Unidades)</label>
                    <input id="stock" type="number" name="stock" value={formData.stock} onChange={handleChange} className={errors.stock ? 'input-error' : ''} />
                    {errors.stock && <p className="error-text">{errors.stock}</p>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange} className={errors.descripcion ? 'input-error' : ''} />
                {errors.descripcion && <p className="error-text">{errors.descripcion}</p>}
            </div>

            <div className="form-group">
                <label>Características</label>
                <div className="caracteristicas-editor">
                    {caracteristicas.map((item, index) => (
                        <div key={index} className="caracteristica-item">
                            <input
                                type="text"
                                placeholder="Característica (ej: Material)"
                                value={item.key}
                                onChange={(e) => handleCaracteristicaChange(index, 'key', e.target.value)}
                                className="caracteristica-input key"
                            />
                            <input
                                type="text"
                                placeholder="Valor (ej: Acero inoxidable)"
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

            <div className="form-group">
                <label>Imágenes del Insumo (hasta 5)</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
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
                <button type="submit" className="btn-form-save">{insumoToEdit ? 'Guardar Cambios' : 'Crear Insumo'}</button>
            </div>
        </form>
    );
};

export default InsumoForm;