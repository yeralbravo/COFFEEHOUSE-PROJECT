import React, { useState, useEffect } from 'react';
import { fetchOrderStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Bar, Pie } from 'react-chartjs-2';
import '../style/AdminStatsPages.css';

const timeRangeLabels = { month: 'Últimos 30 días', week: 'Últimos 7 días', year: 'Último año', all: 'Histórico' };

const AdminOrderStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showErrorAlert } = useAlerts();
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetchOrderStats(timeRange);
                if (response.success) setStats(response.data);
            } catch (err) {
                showErrorAlert(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeRange, showErrorAlert]);

    const ordersOverTimeChartData = {
        labels: stats?.ordersOverTime.map(d => new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })) || [],
        datasets: [{
            label: 'Número de Pedidos',
            data: stats?.ordersOverTime.map(d => d.count) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };

    const orderStatusChartData = {
        labels: stats?.orderStatusDistribution.map(s => s.status) || [],
        datasets: [{
            data: stats?.orderStatusDistribution.map(s => s.count) || [],
            backgroundColor: ['#f5a623', '#4a90e2', '#28a745', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 3,
        }],
    };

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Pedidos</h1>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="filter-select">
                    {Object.entries(timeRangeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </header>

            {loading ? <p>Cargando...</p> : stats && (
                <div className="charts-container-stats">
                    <div className="chart-card large-chart">
                        <h3>Volumen de Pedidos</h3>
                        <div className="chart-wrapper">
                            <Bar data={ordersOverTimeChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Distribución de Estados de Pedido</h3>
                        <div className="pie-chart-container">
                            <Pie data={orderStatusChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderStatsPage;