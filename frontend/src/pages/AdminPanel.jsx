    import React, { useEffect, useState } from 'react';
    import { getDashboardStats } from '../services/adminService'; // <-- IMPORTACIÓN CORREGIDA
    import { useAlerts } from '../hooks/useAlerts';
    import { Line, Bar, Doughnut } from 'react-chartjs-2';
    import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import { FiUsers, FiShoppingCart, FiDollarSign, FiUserPlus } from 'react-icons/fi';
    import '../style/AdminPanel.css';

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

    const StatCard = ({ title, value, icon }) => (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <p>{title}</p>
                <h3>{value}</h3>
            </div>
        </div>
    );

    const timeRangeLabels = {
        month: 'Últimos 30 días',
        week: 'Últimos 7 días',
        year: 'Último año',
        all: 'Histórico',
    };

    const AdminPanel = () => {
        const [stats, setStats] = useState(null);
        const [loading, setLoading] = useState(true);
        const { showErrorAlert } = useAlerts();
        const [timeRange, setTimeRange] = useState('month');
        const [isFilterOpen, setIsFilterOpen] = useState(false);

        useEffect(() => {
            const fetchStats = async () => {
                setLoading(true);
                try {
                    const response = await getDashboardStats(timeRange); // <-- USO CORREGIDO
                    if (response.success) {
                        setStats(response.data);
                    }
                } catch (err) {
                    showErrorAlert(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }, [timeRange, showErrorAlert]);

        const salesChartData = {
            labels: stats?.salesOverTime.map(d => new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })) || [],
            datasets: [{
                label: 'Ingresos',
                data: stats?.salesOverTime.map(d => d.total) || [],
                borderColor: '#24651C',
                backgroundColor: 'rgba(36, 101, 28, 0.1)',
                fill: true,
                tension: 0.4,
            }],
        };

        const topProductsChartData = {
            labels: stats?.topProducts.map(p => p.nombre) || [],
            datasets: [{
                label: 'Unidades Vendidas',
                data: stats?.topProducts.map(p => p.quantity_sold) || [],
                backgroundColor: '#82ca9d',
                borderRadius: 5,
            }],
        };
        
        const userChartData = {
            labels: stats?.userDistribution.map(u => u.role.charAt(0).toUpperCase() + u.role.slice(1)) || [],
            datasets: [{
                data: stats?.userDistribution.map(u => u.count) || [],
                backgroundColor: ['#4a90e2', '#ffc107', '#28a745'],
                borderColor: '#fff',
                borderWidth: 3,
            }],
        };

        const orderChartData = {
            labels: stats?.orderStatusDistribution.map(s => s.status) || [],
            datasets: [{
                data: stats?.orderStatusDistribution.map(s => s.count) || [],
                backgroundColor: ['#f5a623', '#4a90e2', '#28a745', '#dc3545'],
                borderColor: '#fff',
                borderWidth: 3,
            }],
        };

        const chartOptions = {
            plugins: { legend: { position: 'bottom' } },
            maintainAspectRatio: false
        };

        const handleFilterChange = (range) => {
            setTimeRange(range);
            setIsFilterOpen(false);
        };
        
        if (loading) {
            return <p>Cargando dashboard...</p>;
        }

        return (
            <>
                <header className="admin-header">
                    <h1>Dashboard General</h1>
                    <div className="filter-dropdown-container">
                        <button className="filter-dropdown-button" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <span>{timeRangeLabels[timeRange]}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`dropdown-arrow ${isFilterOpen ? 'open' : ''}`}><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        {isFilterOpen && (
                            <div className="filter-dropdown-menu">
                                {Object.entries(timeRangeLabels).map(([key, label]) => (
                                    <div key={key} className="filter-dropdown-item" onClick={() => handleFilterChange(key)}>
                                        {label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </header>
                
                <div className="stats-grid">
                    <StatCard title="Ingresos" value={`$${new Intl.NumberFormat('es-CO').format(stats?.kpis.totalRevenue || 0)}`} icon={<FiDollarSign />} />
                    <StatCard title="Pedidos" value={stats?.kpis.totalOrders || 0} icon={<FiShoppingCart />} />
                    <StatCard title="Nuevos Clientes" value={stats?.kpis.newUsers || 0} icon={<FiUsers />} />
                    <StatCard title="Solicitudes Proveedor" value={stats?.kpis.pendingSuppliers || 0} icon={<FiUserPlus />} />
                </div>

                <div className="charts-container">
                    <div className="chart-card large-chart">
                        <h3>Evolución de Ingresos</h3>
                        <div className="chart-wrapper">
                            <Line data={salesChartData} options={chartOptions} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Top 5 Productos Vendidos</h3>
                        <div className="chart-wrapper">
                            <Bar data={topProductsChartData} options={chartOptions} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Distribución de Usuarios</h3>
                        <div className="pie-chart-container">
                        <Doughnut data={userChartData} options={chartOptions} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Estado de Pedidos</h3>
                        <div className="pie-chart-container">
                        <Doughnut data={orderChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    export default AdminPanel;