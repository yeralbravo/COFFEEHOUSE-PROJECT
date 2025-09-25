import React, { useState, useEffect, useCallback } from 'react';
import { fetchSalesStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FiDollarSign, FiShoppingCart, FiUsers, FiShoppingBag } from 'react-icons/fi';
import StatCard from '../components/admin/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import '../style/AdminStatsPages.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const AdminSalesStatsPage = () => {
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
            const response = await fetchSalesStats(apiParams);
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

    const paymentMethodChartData = {
        labels: stats?.paymentMethodStats.map(p => p.payment_method === 'mercado_pago' ? 'Mercado Pago' : 'Contra Entrega') || [],
        datasets: [{
            data: stats?.paymentMethodStats.map(p => p.total) || [],
            backgroundColor: ['#24651C', '#82ca9d'],
            borderColor: '#fff',
            borderWidth: 3,
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false, // <-- CAMBIO AÑADIDO
        cutout: '60%',
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    const dataArr = ctx.chart.data.datasets[0].data;
                    const sum = dataArr.reduce((a, b) => Number(a) + Number(b), 0);
                    if (value === 0 || sum === 0) return '';
                    const percentage = ((Number(value) / sum) * 100).toFixed(1) + '%';
                    return percentage;
                },
                color: '#fff',
                font: { weight: 'bold', size: 14, },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const sum = context.chart.data.datasets[0].data.reduce((a, b) => Number(a) + Number(b), 0);
                        const percentage = sum > 0 ? `(${( (Number(value) / sum) * 100).toFixed(1)}%)` : '0%';
                        const formattedValue = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
                        return `${label}: ${formattedValue} ${percentage}`;
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: { size: 14 },
                    boxWidth: 15,
                    padding: 20,
                    generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            const sum = data.datasets[0].data.reduce((a, b) => Number(a) + Number(b), 0);
                            return data.labels.map((label, i) => {
                                const ds = data.datasets[0];
                                const value = ds.data[i];
                                const percentage = sum > 0 ? `(${( (Number(value) / sum) * 100).toFixed(1)}%)` : '';
                                const formattedValue = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
                                
                                return {
                                    text: `${label}: ${formattedValue} ${percentage}`,
                                    fillStyle: ds.backgroundColor[i],
                                    strokeStyle: ds.borderColor[i],
                                    lineWidth: ds.borderWidth,
                                    hidden: isNaN(ds.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
            },
        },
    };

    const locationChartData = {
        labels: stats?.locationRevenueStats.map(loc => loc.ciudad) || [],
        datasets: [{
            label: 'Ingresos por Ubicación',
            data: stats?.locationRevenueStats.map(loc => loc.total) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false, // <-- CAMBIO AÑADIDO
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

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Ventas</h1>
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
                        <StatCard title="Ingresos Totales" value={`$${new Intl.NumberFormat('es-CO').format(stats.kpis.totalRevenue)}`} icon={<FiDollarSign />} />
                        <StatCard title="Pedidos Totales" value={stats.kpis.totalOrders} icon={<FiShoppingCart />} />
                        <StatCard title="Total de Clientes Recurrentes" value={stats.kpis.recurringCustomers} icon={<FiUsers />} />
                        <StatCard title="Artículos Vendidos" value={stats.kpis.totalItemsSold} icon={<FiShoppingBag />} />
                    </div>

                    <div className="charts-container-stats two-columns">
                        <div className="chart-card">
                            <h3>Rendimiento por Método de Pago</h3>
                            <div className="pie-chart-container">
                                <Doughnut data={paymentMethodChartData} options={doughnutOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Ingresos por Ciudad</h3>
                            <div className="chart-wrapper">
                                <Bar data={locationChartData} options={barOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminSalesStatsPage;