import React, { useState, useEffect, useCallback } from 'react';
import { fetchProductStats } from '../services/adminService';
import { useAlerts } from '../hooks/useAlerts';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FiCoffee, FiPackage, FiCheckSquare, FiStar } from 'react-icons/fi';
import StatCard from '../components/admin/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import '../style/AdminStatsPages.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const AdminProductStatsPage = () => {
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
            const response = await fetchProductStats(apiParams);
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

    const conversionChartData = {
        labels: stats?.conversionData.map(p => p.item_name) || [],
        datasets: [
            {
                label: 'Vistas',
                data: stats?.conversionData.map(p => p.total_views) || [],
                backgroundColor: '#a7d7b9',
                borderRadius: 4,
            },
            {
                label: 'Ventas',
                data: stats?.conversionData.map(p => p.total_sales) || [],
                backgroundColor: '#24651C',
                borderRadius: 4,
            }
        ],
    };

    const leastSoldChartData = {
        labels: stats?.leastSoldData.map(p => p.item_name) || [],
        datasets: [{
            label: 'Unidades Vendidas',
            data: stats?.leastSoldData.map(p => p.units_sold) || [],
            backgroundColor: '#24651C',
            borderRadius: 4,
        }],
    };

    const commonBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            datalabels: {
                color: function(context) {
                    return context.datasetIndex === 1 ? '#ffffff' : '#1f2937';
                },
                font: {
                    weight: 'bold',
                },
                formatter: (value) => {
                    return value > 0 ? value : '';
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    stepSize: 1,
                }
            }
        }
    };

    const leastSoldBarOptions = {
        ...commonBarOptions,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            datalabels: {
                color: '#ffffff',
                font: { weight: 'bold' },
                formatter: (value) => value > 0 ? value : '',
            },
        },
        scales: {
            x: {
                ticks: {
                    stepSize: 1,
                },
            },
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                }
            }
        }
    };

    return (
        <div className="admin-stats-page">
            <header className="admin-header">
                <h1>Estadísticas de Productos</h1>
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
                        <StatCard title="Total de Cafés" value={stats.kpis.total_products} icon={<FiCoffee />} />
                        <StatCard title="Total de Insumos" value={stats.kpis.total_insumos} icon={<FiPackage />} />
                        <StatCard title="Productos Activos" value={stats.kpis.active_items} icon={<FiCheckSquare />} />
                        <StatCard title="Total de Reseñas" value={stats.kpis.total_reviews} icon={<FiStar />} />
                    </div>

                    <div className="charts-container-stats two-columns">
                        <div className="chart-card">
                            <h3>Tasa de Conversión (Vistas vs. Ventas)</h3>
                            <div className="chart-wrapper">
                                <Bar data={conversionChartData} options={commonBarOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Productos Menos Vendidos</h3>
                            <div className="chart-wrapper">
                                <Bar data={leastSoldChartData} options={leastSoldBarOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminProductStatsPage;