import React, { useState, useEffect, useCallback } from 'react';
import { fetchOrderStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// --- LÍNEA CORREGIDA ---
import { FiShoppingCart, FiXCircle, FiTruck, FiCheckCircle, FiThumbsUp } from 'react-icons/fi';
import StatCard from '../components/admin/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import '../style/AdminStatsPages.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const AdminOrderStatsPage = () => {
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
            const response = await fetchOrderStats(apiParams);
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

    const cancellationChartData = {
        labels: ['Pedidos Exitosos', 'Pedidos Cancelados'],
        datasets: [{
            data: (() => {
                if (!stats) return [0, 0];
                const cancelled = stats.orderStatusDistribution.find(s => s.status === 'Cancelado')?.count || 0;
                const total = stats.orderStatusDistribution.reduce((sum, s) => sum + s.count, 0);
                return [total - cancelled, cancelled];
            })(),
            backgroundColor: ['#24651C', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 3,
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
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
                            const sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return data.labels.map((label, i) => {
                                const ds = data.datasets[0];
                                const value = ds.data[i];
                                const percentage = sum > 0 ? `(${(value / sum * 100).toFixed(1)}%)` : '';
                                return {
                                    text: `${label}: ${value} ${percentage}`,
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
            datalabels: {
                formatter: (value, ctx) => {
                    const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    if (value === 0) return '';
                    const percentage = ((value / sum) * 100).toFixed(1) + '%';
                    return percentage;
                },
                color: '#fff',
                font: { weight: 'bold' },
            },
        },
    };

    const shippingChartData = {
        labels: stats?.shippingCompanyStats.map(s => s.shipping_company) || [],
        datasets: [{
            label: 'Número de Pedidos',
            data: stats?.shippingCompanyStats.map(s => s.order_count) || [],
            backgroundColor: '#82ca9d',
            borderRadius: 4,
        }],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    };

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Pedidos</h1>
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
                        <StatCard title="Pedidos Totales" value={stats.kpis.total_orders} icon={<FiShoppingCart />} />
                        <StatCard title="Pedidos enviados" value={stats.kpis.in_transit_orders} icon={<FiTruck />} />
                        <StatCard title="Pedidos Entregados" value={stats.kpis.delivered_orders} icon={<FiCheckCircle />} />
                        <StatCard title="Tasa de Pedidos Exitosos" value={`${parseFloat(stats.kpis.successful_delivery_rate).toFixed(1)}%`} icon={<FiThumbsUp />} />
                    </div>

                    <div className="charts-container-stats two-columns">
                        <div className="chart-card">
                            <h3>Tasa de Cancelación de Pedidos</h3>
                            <div className="pie-chart-container">
                                <Doughnut data={cancellationChartData} options={doughnutOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Rendimiento por Empresa de Envío</h3>
                            <div className="chart-wrapper">
                                <Bar data={shippingChartData} options={barOptions} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminOrderStatsPage;