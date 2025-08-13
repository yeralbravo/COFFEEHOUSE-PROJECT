import React, { useState, useEffect } from 'react';
import { fetchSalesStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Line } from 'react-chartjs-2';
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import StatCard from '../components/admin/StatCard'; // <-- RUTA CORREGIDA
import '../style/AdminStatsPages.css';

const timeRangeLabels = { month: 'Últimos 30 días', week: 'Últimos 7 días', year: 'Último año', all: 'Histórico' };

const AdminSalesStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showErrorAlert } = useAlerts();
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetchSalesStats(timeRange);
                if (response.success) setStats(response.data);
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

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Ventas</h1>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="filter-select">
                    {Object.entries(timeRangeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </header>

            {loading ? <p>Cargando...</p> : stats && (
                <>
                    <div className="stats-grid">
                        <StatCard title="Ingresos Totales" value={`$${new Intl.NumberFormat('es-CO').format(stats.kpis.totalRevenue)}`} icon={<FiDollarSign />} />
                        <StatCard title="Pedidos Totales" value={stats.kpis.totalOrders} icon={<FiShoppingCart />} />
                        <StatCard title="Valor Promedio por Pedido" value={`$${new Intl.NumberFormat('es-CO').format(stats.kpis.averageOrderValue)}`} icon={<FiTrendingUp />} />
                        <StatCard title="Artículos Vendidos" value={stats.kpis.totalItemsSold} icon={<FiShoppingBag />} />
                    </div>
                    <div className="charts-container-stats">
                        <div className="chart-card large-chart">
                            <h3>Evolución de Ingresos</h3>
                            <div className="chart-wrapper">
                                <Line data={salesChartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminSalesStatsPage;