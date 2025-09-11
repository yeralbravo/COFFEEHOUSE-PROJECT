import React, { useState, useEffect, useCallback } from 'react';
import { fetchUserStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FiUsers, FiUserPlus, FiBriefcase, FiShield } from 'react-icons/fi';
import StatCard from '../components/admin/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import '../style/AdminStatsPages.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const AdminUserStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showErrorAlert } = useAlerts();
    const [timeRange, setTimeRange] = useState('month');
    const [selectedDate, setSelectedDate] = useState('');

    const fetchStats = useCallback(async () => {
        setLoading(true);
        const apiParams = {};
        if (selectedDate) {
            apiParams.startDate = selectedDate;
            apiParams.endDate = selectedDate;
        } else {
            apiParams.range = timeRange;
        }
        try {
            const response = await fetchUserStats(apiParams);
            if (response.success) setStats(response.data);
        } catch (err) {
            showErrorAlert(err.message);
        } finally {
            setLoading(false);
        }
    }, [timeRange, selectedDate, showErrorAlert]);
    
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const aovByRoleChartData = {
        labels: stats?.aovByRole.map(r => r.role === 'client' ? 'Clientes' : 'Proveedores') || [],
        datasets: [{
            label: 'Valor de Compra Promedio',
            data: stats?.aovByRole.map(r => r.average_order_value) || [],
            backgroundColor: ['#24651C', '#82ca9d'],
            borderRadius: 4,
        }],
    };

    const aovByRoleOptions = {
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
                    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', notation: 'compact' }).format(value);
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', notation: 'compact' }).format(value)
                }
            }
        }
    };

    const activeUsersChartData = {
        labels: stats?.activeUsersOverTime.map(d => new Date(d.month).toLocaleDateString('es-CO', { timeZone: 'UTC', year: 'numeric', month: 'short' })) || [],
        datasets: [{
            label: 'Clientes Activos',
            data: stats?.activeUsersOverTime.map(d => d.active_users) || [],
            backgroundColor: '#24651C',
            borderRadius: 4,
        }],
    };

    // --- OPCIONES DE GRÁFICA ACTUALIZADAS ---
    const activeUsersOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            // --- CÓDIGO AÑADIDO ---
            datalabels: {
                color: '#ffffff',
                font: { weight: 'bold' },
                anchor: 'center',
                align: 'center',
                formatter: (value) => value > 0 ? value : '', // Muestra el número si es mayor a 0
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Usuarios</h1>
                <TimeRangeFilter
                    currentRange={timeRange}
                    onRangeChange={setTimeRange}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            </header>

            {loading ? <p>Cargando...</p> : stats && (
                <>  
                    <div className="stats-grid">
                        <StatCard title="Total de Clientes" value={stats.kpis.total_clients} icon={<FiUsers />} />
                        <StatCard title="Total de Proveedores" value={stats.kpis.total_suppliers} icon={<FiBriefcase />} />
                        <StatCard title="Total de Administradores" value={stats.kpis.total_admins} icon={<FiShield />} />
                        <StatCard title="Nuevos Usuarios (Período)" value={stats.kpis.new_users_in_period} icon={<FiUserPlus />} />
                    </div>

                    <div className="charts-container-stats two-columns">
                        <div className="chart-card">
                            <h3>Valor de Compra Promedio por Tipo de Usuario</h3>
                            <div className="chart-wrapper">
                                <Bar data={aovByRoleChartData} options={aovByRoleOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Clientes Activos por Mes</h3>
                            <div className="chart-wrapper">
                                {/* --- COMPONENTE ACTUALIZADO --- */}
                                <Bar data={activeUsersChartData} options={activeUsersOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUserStatsPage;