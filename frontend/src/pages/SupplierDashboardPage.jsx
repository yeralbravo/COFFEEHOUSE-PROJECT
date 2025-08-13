import React, { useState, useEffect } from 'react';
import { FiPackage, FiDollarSign, FiList, FiAlertTriangle } from 'react-icons/fi';
import { getDashboardData } from '../services/supplierService';
import StatCard from '../components/supplier/StatCard';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../style/SupplierDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const timeRangeOptions = {
    day: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año'
};

const SupplierDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('month'); // Filtro por defecto

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getDashboardData(range);
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error al cargar estadísticas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [range]);

    const lineChartData = {
        labels: stats?.salesData.map(d => new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })) || [],
        datasets: [{
            label: 'Ventas',
            data: stats?.salesData.map(d => d.total) || [],
            borderColor: '#24651C',
            backgroundColor: 'rgba(36, 101, 28, 0.1)',
            fill: true,
            tension: 0.3,
        }],
    };

    const barChartData = {
        labels: stats?.topProducts.map(p => p.name) || [],
        datasets: [{
            label: 'Unidades Vendidas',
            data: stats?.topProducts.map(p => p.quantity_sold) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard de Rendimiento</h1>
                <div className="time-filters">
                    {Object.entries(timeRangeOptions).map(([key, label]) => (
                        <button key={key} onClick={() => setRange(key)} className={range === key ? 'active' : ''}>
                            {label}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? <p>Cargando dashboard...</p> : stats && (
                <>
                    <div className="stats-grid">
                        <StatCard icon={<FiPackage />} title="Total de Productos" value={stats.summary.totalProducts} link="/supplier/products" linkText="Ver productos" />
                        <StatCard icon={<FiDollarSign />} title={`Ventas de ${timeRangeOptions[range]}`} value={`$${new Intl.NumberFormat('es-CO').format(stats.summary.totalSales)}`} link="/supplier/stats/sales" linkText="Ver reporte de ventas" />
                        <StatCard icon={<FiList />} title="Pedidos Pendientes" value={stats.summary.pendingOrders} link="/supplier/orders" linkText="Gestionar pedidos" />
                        <StatCard icon={<FiAlertTriangle />} title="Productos con Bajo Stock" value={stats.summary.lowStockCount} link="/supplier/stats/low-stock" linkText="Ver inventario" />
                    </div>
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Ventas a lo largo del tiempo</h3>
                            <Line data={lineChartData} />
                        </div>
                        <div className="chart-card">
                            <h3>Productos más vendidos</h3>
                            <Bar data={barChartData} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierDashboardPage;