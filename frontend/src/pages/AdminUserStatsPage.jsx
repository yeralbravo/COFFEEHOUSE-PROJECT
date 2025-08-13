import React, { useState, useEffect } from 'react';
import { fetchUserStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Line, Pie } from 'react-chartjs-2';
import '../style/AdminStatsPages.css';

const timeRangeLabels = { month: 'Últimos 30 días', week: 'Últimos 7 días', year: 'Último año', all: 'Histórico' };

const AdminUserStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showErrorAlert } = useAlerts();
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetchUserStats(timeRange);
                if (response.success) setStats(response.data);
            } catch (err) {
                showErrorAlert(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeRange, showErrorAlert]);

    const newUsersChartData = {
        labels: stats?.newUsersOverTime.map(d => new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })) || [],
        datasets: [{
            label: 'Nuevos Clientes',
            data: stats?.newUsersOverTime.map(d => d.count) || [],
            borderColor: '#4a90e2',
            backgroundColor: 'rgba(74, 144, 226, 0.1)',
            fill: true,
            tension: 0.4,
        }],
    };

    const userDistributionChartData = {
        labels: stats?.userDistribution.map(u => u.role.charAt(0).toUpperCase() + u.role.slice(1)) || [],
        datasets: [{
            data: stats?.userDistribution.map(u => u.count) || [],
            backgroundColor: ['#4a90e2', '#ffc107', '#28a745'],
            borderColor: '#fff',
            borderWidth: 3,
        }],
    };

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Usuarios</h1>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="filter-select">
                    {Object.entries(timeRangeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </header>

            {loading ? <p>Cargando...</p> : stats && (
                <div className="charts-container-stats">
                    <div className="chart-card large-chart">
                        <h3>Registro de Nuevos Clientes</h3>
                        <div className="chart-wrapper">
                            <Line data={newUsersChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Distribución Total de Usuarios por Rol</h3>
                        <div className="pie-chart-container">
                            <Pie data={userDistributionChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserStatsPage;