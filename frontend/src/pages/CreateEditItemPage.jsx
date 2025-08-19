import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiUploadCloud, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAlerts } from '../hooks/useAlerts';
import * as productService from '../services/productService';
import * as insumoService from '../services/insumoService';
import '../style/CreateEditItemPage.css';

const CreateEditItemPage = () => {
    const { itemType: paramType, itemId } = useParams(); // <--- CORRECCIÓN AQUÍ
    const location = useLocation();
    const navigate = useNavigate();
    const { showSuccessAlert, showErrorAlert } = useAlerts();

    const queryParams = new URLSearchParams(location.search);
    const typeFromQuery = queryParams.get('type');
    const [itemType, setItemType] = useState(paramType || typeFromQuery || 'product');

    const isEditing = Boolean(itemId);
    const isProduct = itemType === 'product';

    const [formData, setFormData] = useState({});
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([{ key: '', value: '' }]);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);
    
    const formatPrice = (value) => {
        if (!value) return '';
        const numericValue = value.toString().replace(/[^0-9]/g, '');
        if (numericValue === '') return '';
        return new Intl.NumberFormat('es-CO').format(numericValue);
    };

    useEffect(() => {
        if (isEditing && itemId && !hasFetched.current) {
            setLoading(true);
            hasFetched.current = true;

            const fetchItem = isProduct ? productService.getProductById(itemId) : insumoService.getInsumoById(itemId);
            
            fetchItem.then(res => {
                const item = res.data;
                setFormData({
                    nombre: item.nombre || '',
                    marca: item.marca || '',
                    precio: formatPrice(item.precio) || '',
                    stock: item.stock ?? '',
                    descripcion: item.descripcion || '',
                    tipo: item.tipo || '',
                    categoria: item.categoria || '',
                    peso_neto: item.peso_neto ?? '',
                });
                if (item.caracteristicas && typeof item.caracteristicas === 'object') {
                    const caracteristicasArray = Object.entries(item.caracteristicas).map(([key, value]) => ({ key, value }));
                    if (caracteristicasArray.length > 0) setCaracteristicas(caracteristicasArray);
                }
                if (item.images) {
                    setImagePreviews(item.images.map(img => `http://localhost:5000/${img}`));
                }
            }).catch(err => showErrorAlert(err.message)).finally(() => setLoading(false));
        }
    }, [itemId, isEditing, isProduct, showErrorAlert]);

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
        imageFiles.forEach(file => finalFormData.append(isProduct ? 'product_images' : 'insumo_images', file));

        try {
            if (isEditing) {
                const updatePromise = isProduct ? productService.updateProduct(itemId, finalFormData) : insumoService.updateInsumo(itemId, finalFormData);
                await updatePromise;
                showSuccessAlert('Ítem actualizado con éxito.');
            } else {
                const createPromise = isProduct ? productService.createProduct(finalFormData) : insumoService.createInsumo(finalFormData);
                await createPromise;
                showSuccessAlert('Ítem creado con éxito.');
            }
            navigate(isProduct ? '/supplier/products' : '/supplier/insumos');
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    if (loading && isEditing) return <p>Cargando...</p>;

    return (
        <div className="add-edit-item-page">
            <h1>{isEditing ? `Editar ${isProduct ? 'Café' : 'Insumo'}` : 'Agregar Nuevo Ítem'}</h1>
            
            {!isEditing && (
                <div className="item-type-selector">
                    <button className={isProduct ? 'active' : ''} onClick={() => setItemType('product')}>Café</button>
                    <button className={!isProduct ? 'active' : ''} onClick={() => setItemType('insumo')}>Insumo</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="item-form-layout">
                <div className="form-section image-section">
                    <h3>Imágenes del Ítem</h3>
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
                    <h3>Detalles del {isProduct ? 'Café' : 'Insumo'}</h3>
                    <div className="form-grid">
                        <input name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Nombre *" required />
                        <input name="marca" value={formData.marca || ''} onChange={handleChange} placeholder="Marca *" required />
                        {isProduct ? (
                            <>
                                <input name="tipo" value={formData.tipo || ''} onChange={handleChange} placeholder="Tipo de café (ej. Grano) *" required />
                                <input name="peso_neto" type="number" value={formData.peso_neto || ''} onChange={handleChange} placeholder="Peso neto en gramos" />
                            </>
                        ) : (
                            <input name="categoria" value={formData.categoria || ''} onChange={handleChange} placeholder="Categoría (ej. Cafeteras) *" required />
                        )}
                        
                        <input 
                            name="precio" 
                            type="text"
                            inputMode="numeric"
                            value={formData.precio || ''} 
                            onChange={handleChange} 
                            placeholder="Precio *" 
                            required 
                        />
                        
                        <input name="stock" type="number" value={formData.stock || ''} onChange={handleChange} placeholder="Cantidad de stock *" required />
                    </div>
                    <textarea name="descripcion" value={formData.descripcion || ''} onChange={handleChange} placeholder="Descripción *" required />

                    <h3>Características Adicionales</h3>
                    <div className="caracteristicas-container">
                        {caracteristicas.map((item, index) => (
                            <div key={index} className="caracteristica-item">
                                <input className="key" value={item.key} onChange={(e) => handleCaracteristicaChange(index, 'key', e.target.value)} placeholder="Característica" />
                                <input className="value" value={item.value} onChange={(e) => handleCaracteristicaChange(index, 'value', e.target.value)} placeholder="Valor" />
                                <button type="button" onClick={() => removeCaracteristica(index)}><FiTrash2 /></button>
                            </div>
                        ))}
                        <button type="button" className="btn-add-feature" onClick={addCaracteristica}><FiPlus /> Agregar característica</button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate(isProduct ? '/supplier/products' : '/supplier/insumos')}>Cancelar</button>
                    <button type="submit" className="btn-save">Guardar</button>
                </div>
            </form>
        </div>
    );
};

export default CreateEditItemPage;