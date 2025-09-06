import React, { useState, useEffect, useCallback } from 'react';
import { FiPackage, FiDollarSign, FiList, FiAlertTriangle } from 'react-icons/fi';
import { getDashboardData } from '../services/supplierService';
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

    return {
        start: formatDateSafe(monday),
        end: formatDateSafe(sunday),
    };
};

const SupplierDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('week');
    const [selectedDate, setSelectedDate] = useState('');

    const timeRangeLabels = {
        day: 'Hoy',
        week: 'Esta Semana',
        month: 'Este Mes',
        year: 'Este Año'
    };

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
            const response = await getDashboardData(apiParams);
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error(`Error al cargar datos:`, error);
        } finally {
            setLoading(false);
        }
    }, [range, selectedDate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const salesBarChartData = {
        labels: stats?.salesData.map(d => new Date(d.date).toLocaleDateString('es-CO', { timeZone: 'UTC', month: 'short', day: 'numeric' })) || [],
        datasets: [{
            label: 'Ventas',
            data: stats?.salesData.map(d => d.total) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };
    
    // --- OPCIONES DE GRÁFICA DE VENTAS ACTUALIZADAS ---
    const salesBarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', notation: 'compact' }).format(value);
                    }
                }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y || 0;
                        return `Ventas: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)}`;
                    }
                }
            },
            // --- CÓDIGO AÑADIDO ---
            datalabels: {
                color: '#ffffff',
                font: { weight: 'bold' },
                anchor: 'center',
                align: 'center',
                formatter: (value) => {
                    if (value < 1000) return null; // No mostrar etiquetas para valores muy pequeños
                    return new Intl.NumberFormat('es-CO', { 
                        style: 'currency', currency: 'COP', notation: 'compact', maximumFractionDigits: 0 
                    }).format(value);
                }
            }
        }
    };

    const topProductsChartData = {
        labels: stats?.topProducts.map(p => p.name) || [],
        datasets: [{
            label: 'Unidades Vendidas',
            data: stats?.topProducts.map(p => p.quantity_sold) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };
    
    // --- OPCIONES DE GRÁFICA DE PRODUCTOS ACTUALIZADAS ---
    const topProductsChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            // --- CÓDIGO AÑADIDO ---
            datalabels: {
                color: '#ffffff',
                font: { weight: 'bold' },
                anchor: 'center',
                align: 'center',
                formatter: (value) => value, // Muestra el número de unidades
            }
        }
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard de Rendimiento</h1>
                <TimeRangeFilter
                    currentRange={range}
                    onRangeChange={setRange}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate} 
                />
            </header>

            {loading ? <p>Cargando dashboard...</p> : stats && (
                <>
                    <div className="stats-grid">
                        <StatCard 
                            icon={<FiDollarSign />} 
                            title={`Ventas de ${selectedDate ? 'la fecha seleccionada' : timeRangeLabels[range]}`} 
                            value={`$${new Intl.NumberFormat('es-CO').format(stats.summary.totalSales)}`} 
                            link="/supplier/stats/sales" 
                            linkText="Ver reporte de ventas" 
                        />
                        <StatCard icon={<FiList />} title="Pedidos Pendientes" value={stats.summary.pendingOrders} link="/supplier/orders" linkText="Gestionar pedidos" />
                        <StatCard icon={<FiAlertTriangle />} title="Productos con Bajo Stock" value={stats.summary.lowStockCount} link="/supplier/stats/low-stock" linkText="Ver inventario" />
                        <StatCard icon={<FiPackage />} title="Total de Productos" value={stats.summary.totalProducts} />
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Resumen de Ingresos</h3>
                            {stats?.salesData && stats.salesData.length > 0 ? (
                                <div className="chart-container">
                                    {/* --- COMPONENTE ACTUALIZADO --- */}
                                    <Bar options={salesBarChartOptions} data={salesBarChartData} plugins={[ChartDataLabels]} />
                                </div>
                            ) : (
                                <div className="no-data-message">
                                    <p>No hay datos de ventas para este período.</p>
                                </div>
                            )}
                        </div>
                        <div className="chart-card">
                            <h3>Productos más vendidos</h3>
                            {stats?.topProducts && stats.topProducts.length > 0 ? (
                                <div className="chart-container">
                                    {/* --- COMPONENTE ACTUALIZADO --- */}
                                    <Bar options={topProductsChartOptions} data={topProductsChartData} plugins={[ChartDataLabels]} />
                                </div>
                            ) : (
                                <div className="no-data-message">
                                    <p>No hay productos vendidos en este período.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierDashboardPage;