import React, { useState, useEffect } from 'react';
import { fetchProductStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../style/AdminStatsPages.css';

const timeRangeLabels = { month: 'Últimos 30 días', week: 'Últimos 7 días', year: 'Último año', all: 'Histórico' };

const AdminProductStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showErrorAlert } = useAlerts();
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetchProductStats(timeRange);
                if (response.success) setStats(response.data);
            } catch (err) {
                showErrorAlert(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeRange, showErrorAlert]);

    const topProductsChartData = {
        labels: stats?.topProducts.map(p => p.nombre) || [],
        datasets: [{
            label: 'Ingresos por Producto',
            data: stats?.topProducts.map(p => p.revenue) || [],
            backgroundColor: '#82ca9d',
            borderRadius: 5,
        }],
    };

    const stockChartData = {
        labels: ['En Stock', 'Bajo Stock', 'Agotado'],
        datasets: [{
            // eslint-disable-next-line no-constant-binary-expression
            data: [stats?.stockStatus.in_stock, stats?.stockStatus.low_stock, stats?.stockStatus.out_of_stock] || [],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 3,
        }],
    };

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Productos</h1>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="filter-select">
                    {Object.entries(timeRangeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </header>

            {loading ? <p>Cargando...</p> : stats && (
                <div className="charts-container-stats">
                    <div className="chart-card large-chart">
                        <h3>Top 10 Productos por Ingresos</h3>
                        <div className="chart-wrapper">
                            <Bar data={topProductsChartData} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Estado General del Inventario</h3>
                        <div className="pie-chart-container">
                            <Doughnut data={stockChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductStatsPage;