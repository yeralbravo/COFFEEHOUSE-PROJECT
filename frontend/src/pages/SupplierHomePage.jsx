import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import * as productService from '../services/productService';
import { useAlerts } from '../hooks/useAlerts';
import SupplierHeader from '../components/supplier/SupplierHeader';
import SupplierSidebar from '../components/supplier/SupplierSidebar';
import SupplierProductCard from '../components/supplier/SupplierProductCard';
import ProductForm from '../components/supplier/ProductForm'; // Para el modal
import '../style/SupplierHomePage.css';

const SupplierHomePage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { showSuccessAlert, showErrorAlert, showConfirmDialog } = useAlerts();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getSupplierProducts();
            setProducts(response.data);
        } catch (error) {
            showErrorAlert(error.message || 'Error al obtener los productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingProduct) {
                const productData = Object.fromEntries(formData.entries());
                await productService.updateProduct(editingProduct.id, productData);
                showSuccessAlert('Producto actualizado con éxito');
            } else {
                await productService.createProduct(formData);
                showSuccessAlert('Producto creado con éxito');
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            showErrorAlert(error.message || 'Ocurrió un error al guardar el producto.');
        }
    };

    const handleDeleteProduct = (productId) => {
        showConfirmDialog({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el producto permanentemente.'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await productService.deleteProduct(productId);
                    showSuccessAlert('Producto eliminado correctamente.');
                    fetchProducts();
                } catch (error) {
                    showErrorAlert(error.message || 'Error al eliminar el producto.');
                }
            }
        });
    };

    return (
        <div className="supplier-home-page">
            <SupplierHeader onMenuClick={() => setSidebarOpen(true)} />
            <SupplierSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="catalog-content">
                <div className="catalog-header">
                    <h1 className="catalog-title">Mis Productos</h1>
                    <button className="add-product-btn" onClick={() => handleOpenModal()}>
                        <FiPlus /> Añadir Producto
                    </button>
                </div>
                {loading ? <p>Cargando productos...</p> : (
                    <div className="products-grid">
                        {products.map(product => (
                            <SupplierProductCard 
                                key={product.id}
                                product={product}
                                onEdit={handleOpenModal}
                                onDelete={handleDeleteProduct}
                            />
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
                            <button onClick={handleCloseModal} className="close-btn">&times;</button>
                        </div>
                        <ProductForm 
                            onSubmit={handleFormSubmit} 
                            productToEdit={editingProduct}
                            onCancel={handleCloseModal} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierHomePage;