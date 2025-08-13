import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiBarChart2, FiList, FiDollarSign, FiPlusCircle, FiEye } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import * as productService from '../services/productService';
import Sidebar from '../components/SidebarSupplier';
import '../style/SupplierDashboard.css';

const SupplierDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        totalSales: 'N/A', // Placeholder - requeriría lógica de pedidos
        newOrders: 'N/A'   // Placeholder - requeriría lógica de pedidos
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await productService.getSupplierProducts();
                const products = response.data;
                
                // Calculamos estadísticas basadas en los productos
                const totalProducts = products.length;
                const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
                setStats(prev => ({ ...prev, totalProducts, lowStock }));
                
                // Tomamos los 5 productos más recientes (el backend los ordena por fecha de creación)
                setRecentProducts(products.slice(0, 5));

            } catch (error) {
                console.error("Error al cargar datos del dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    
    const API_BASE_URL = 'http://localhost:5000';

    if (loading) {
        return (
            <div className="admin-layout">
                <Sidebar />
                <main className="supplier-dashboard-container">
                    <p>Cargando panel...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="supplier-dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">¡Bienvenido, {user?.nombre}!</h1>
                    <p className="dashboard-subtitle">Aquí tienes un resumen de tu tienda.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="icon-wrapper icon-products"><FiPackage /></div>
                        <div className="stat-info">
                            <p className="value">{stats.totalProducts}</p>
                            <p className="label">Productos Totales</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon-wrapper icon-sales"><FiDollarSign /></div>
                        <div className="stat-info">
                            <p className="value">{stats.totalSales}</p>
                            <p className="label">Ventas Totales</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon-wrapper icon-orders"><FiList /></div>
                        <div className="stat-info">
                            <p className="value">{stats.newOrders}</p>
                            <p className="label">Pedidos Nuevos</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon-wrapper icon-low-stock"><FiBarChart2 /></div>
                        <div className="stat-info">
                            <p className="value">{stats.lowStock}</p>
                            <p className="label">Productos con Bajo Stock</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-sections-grid">
                    <section className="dashboard-section">
                        <h2 className="section-title">Acciones Rápidas</h2>
                        <div className="quick-actions-list">
                            <Link to="/supplier/products" className="quick-action-link"><FiPlusCircle /> Añadir un Nuevo Producto</Link>
                            <Link to="/supplier/products" className="quick-action-link"><FiEye /> Ver todos mis Productos</Link>
                            <Link to="/supplier/orders" className="quick-action-link"><FiList /> Gestionar Pedidos</Link>
                        </div>
                    </section>

                    <section className="dashboard-section">
                        <h2 className="section-title">Productos Recientes</h2>
                        {recentProducts.length > 0 ? (
                            <div className="recent-products-list">
                                {recentProducts.map(product => (
                                    <div key={product.id} className="recent-product-item">
                                        <img src={product.images.length > 0 ? `${API_BASE_URL}/${product.images[0]}` : 'https://via.placeholder.com/50'} alt={product.nombre} />
                                        <div className="product-details">
                                            <p>{product.nombre}</p>
                                            <span>Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-products-message">Aún no has añadido ningún producto.</p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default SupplierDashboard;