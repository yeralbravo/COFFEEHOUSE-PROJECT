import React, { useState, useEffect, useCallback } from 'react';
import { FiPackage, FiCoffee, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { getProductStats } from '../services/supplierService'; 
import StatCard from '../components/supplier/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../style/SupplierDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const formatDateSafe = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getWeekRange = () => {
    const today = new Date();
    const dayOfWeek = (today.getDay() === 0) ? 6 : today.getDay() - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: formatDateSafe(monday), end: formatDateSafe(sunday) };
};

const SupplierProductStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('month');
    const [selectedDate, setSelectedDate] = useState('');

    const fetchStats = useCallback(async () => {
        setLoading(true);
        let apiParams = {};
        const today = new Date();

        if (selectedDate) {
            apiParams = { startDate: selectedDate, endDate: selectedDate };
        } else {
            switch (range) {
                case 'week':
                    const weekRange = getWeekRange();
                    apiParams = { startDate: weekRange.start, endDate: weekRange.end };
                    break;
                case 'month':
                    apiParams = {
                        startDate: formatDateSafe(new Date(today.getFullYear(), today.getMonth(), 1)),
                        endDate: formatDateSafe(today)
                    };
                    break;
                case 'year':
                    apiParams = {
                        startDate: formatDateSafe(new Date(today.getFullYear(), 0, 1)),
                        endDate: formatDateSafe(today)
                    };
                    break;
                case 'day':
                default:
                    apiParams = {
                        startDate: formatDateSafe(today),
                        endDate: formatDateSafe(today)
                    };
                    break;
            }
        }

        try {
            const response = await getProductStats(apiParams);
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error al cargar estadísticas de productos", error);
        } finally {
            setLoading(false);
        }
    }, [range, selectedDate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Gráfica: Productos más Vistos
    const topViewedProductsData = {
        labels: stats?.topViewedProducts.map(p => p.name) || [],
        datasets: [{
            label: 'Número de Vistas',
            data: stats?.topViewedProducts.map(p => p.total_views) || [],
            // --- ¡CAMBIO DE COLOR AQUÍ! ---
            backgroundColor: '#3E7B27', // Mismo color que la otra gráfica
            borderRadius: 5,
        }],
    };

    const topViewedOptions = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `Vistas: ${context.parsed.x}`
                }
            },
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#ffffff', // Color blanco para el texto
                font: { weight: 'bold' },
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                }
            }
        }
    };

    // Gráfica: Top 5 Productos Mejor Calificados
    const topRatedProductsData = {
        labels: stats?.topRatedProducts.map(p => p.name) || [],
        datasets: [{
            label: 'Calificación Promedio',
            data: stats?.topRatedProducts.map(p => p.avg_rating) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };

    const topRatedOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `Calificación: ${Number(context.parsed.y).toFixed(1)} ★`
                }
            },
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#ffffff',
                font: { weight: 'bold', size: 14 },
                formatter: (value) => `${Number(value).toFixed(1)} ★`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
            }
        }
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Estadísticas de Productos</h1>
                <TimeRangeFilter
                    currentRange={range}
                    onRangeChange={setRange}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate} 
                />
            </header>

            {loading ? <p>Cargando estadísticas...</p> : stats && (
                <>
                    <div className="stats-grid">
                        <StatCard 
                            icon={<FiCoffee />} 
                            title="Total de Cafés" 
                            value={stats.kpis.total_products} 
                            link="/supplier/products"
                            linkText="Gestionar cafés"
                        />
                        <StatCard 
                            icon={<FiPackage />} 
                            title="Total de Insumos" 
                            value={stats.kpis.total_insumos}
                            link="/supplier/insumos"
                            linkText="Gestionar insumos"
                        />
                        <StatCard 
                            icon={<FiAlertTriangle />} 
                            title="Ítems con Bajo Stock" 
                            value={stats.kpis.low_stock}
                            link="/supplier/stats/low-stock"
                            linkText="Ver inventario"
                        />
                        <StatCard 
                            icon={<FiXCircle />} 
                            title="Ítems Agotados" 
                            value={stats.kpis.out_of_stock} 
                        />
                    </div>
                    
                    <div className="charts-grid two-columns">
                        <div className="chart-card">
                            <h3>Productos más Vistos 👀</h3>
                            <div className="chart-container" style={{height: '350px'}}>
                                <Bar data={topViewedProductsData} options={topViewedOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Top 5 Productos con Mejor Calificación</h3>
                            <div className="chart-container" style={{height: '350px'}}>
                                <Bar data={topRatedProductsData} options={topRatedOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierProductStatsPage;