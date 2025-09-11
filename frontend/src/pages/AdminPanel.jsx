import React, { useEffect, useState, useCallback } from 'react';
import { getDashboardStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FiUsers, FiShoppingCart, FiDollarSign, FiUserPlus } from 'react-icons/fi';
import TimeRangeFilter from '../components/TimeRangeFilter';
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

const AdminPanel = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showErrorAlert } = useAlerts();
    const [timeRange, setTimeRange] = useState('month');
    const [selectedDate, setSelectedDate] = useState('');

    const fetchStats = useCallback(async () => {
        setLoading(true);
        const apiParams = {};

        if (selectedDate) {
            // Si el usuario elige una fecha, esos son los parámetros
            apiParams.startDate = selectedDate;
            apiParams.endDate = selectedDate;
        } else {
            // Si no, se usa el rango predefinido (mes, semana, etc.)
            apiParams.range = timeRange;
        }

        try {
            // El servicio ahora sabe cómo manejar ambos casos
            const response = await getDashboardStats(apiParams);
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            showErrorAlert(err.message);
        } finally {
            setLoading(false);
        }
    }, [timeRange, selectedDate, showErrorAlert]);


    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const salesChartData = {
        labels: stats?.salesOverTime.map(d => new Date(d.date).toLocaleDateString('es-CO', { timeZone: 'UTC', month: 'short', day: 'numeric' })) || [],
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

    const topSuppliersChartData = {
        labels: stats?.topSuppliers.map(s => s.supplier_name) || [],
        datasets: [{
            label: 'Ingresos Generados',
            data: stats?.topSuppliers.map(s => s.total_revenue) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }]
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

    const topSuppliersOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: '#ffffff',
                font: { weight: 'bold' },
                anchor: 'center',
                align: 'center',
                formatter: (value) => {
                    if (value < 1) return null;
                    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', notation: 'compact' }).format(value);
                }
            }
        }
    };
    
    if (loading) {
        return <p>Cargando dashboard...</p>;
    }

    return (
        <>
            <header className="admin-header">
                <h1>Dashboard General</h1>
                <TimeRangeFilter
                    currentRange={timeRange}
                    onRangeChange={setTimeRange}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            </header>
            
            <div className="stats-grid">
                <StatCard title="Ingresos" value={`$${new Intl.NumberFormat('es-CO').format(stats?.kpis.totalRevenue || 0)}`} icon={<FiDollarSign />} />
                <StatCard title="Pedidos" value={stats?.kpis.totalOrders || 0} icon={<FiShoppingCart />} />
                <StatCard title="Nuevos Clientes" value={stats?.kpis.newUsers || 0} icon={<FiUsers />} />
                <StatCard title="Solicitudes Proveedor" value={stats?.kpis.pendingSuppliers || 0} icon={<FiUserPlus />} />
            </div>

            <div className="charts-main-container">
                <div className="chart-card full-width-card">
                    <h3>Evolución de Ingresos</h3>
                    <div className="chart-wrapper">
                        <Line data={salesChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
                <div className="charts-grid-2x2">
                    <div className="chart-card">
                        <h3>Top 5 Productos Vendidos</h3>
                        <div className="chart-wrapper">
                            <Bar data={topProductsChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Top 5 Proveedores por Ingresos</h3>
                        <div className="chart-wrapper">
                           <Bar data={topSuppliersChartData} options={topSuppliersOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Distribución de Usuarios</h3>
                        <div className="chart-wrapper pie-container">
                           <Doughnut data={userChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Estado de Pedidos</h3>
                        <div className="chart-wrapper pie-container">
                           <Doughnut data={orderChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;