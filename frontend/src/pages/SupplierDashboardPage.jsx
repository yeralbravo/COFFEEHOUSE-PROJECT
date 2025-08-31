import React, { useState, useEffect } from 'react';
import { FiPackage, FiDollarSign, FiList, FiAlertTriangle } from 'react-icons/fi';
import { getDashboardData } from '../services/supplierService';

// Componentes reutilizables
import StatCard from '../components/supplier/StatCard';
// CORREGIDO: Ruta de importación para TimeRangeFilter
import TimeRangeFilter from '../components/TimeRangeFilter';

// Gráficas
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Estilos
import '../style/SupplierDashboard.css';

// Registramos solo los componentes necesarios para las gráficas de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);


// --- LÓGICA DE FECHAS ---
const formatDate = (date) => date.toISOString().split('T')[0];

const getWeekRange = () => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
        start: formatDate(monday),
        end: formatDate(sunday),
    };
};
// --- FIN DE LÓGICA DE FECHAS ---


const SupplierDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('month');
    const [selectedDate, setSelectedDate] = useState('');

    const timeRangeLabels = {
        day: 'Hoy',
        week: 'Esta Semana',
        month: 'Este Mes',
        year: 'Este Año'
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                
                let apiParams = {};
                const today = new Date();

                if (selectedDate) {
                    apiParams = { startDate: selectedDate, endDate: selectedDate };
                } else {
                    let startDate;
                    const endDate = new Date(today); 

                    switch (range) {
                        case 'week':
                            const weekRange = getWeekRange();
                            startDate = new Date(weekRange.start);
                            endDate.setTime(new Date(weekRange.end).getTime());
                            break;
                        case 'month':
                            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                            break;
                        case 'year':
                            startDate = new Date(today.getFullYear(), 0, 1);
                            break;
                        case 'day':
                        default:
                            startDate = new Date(new Date().setHours(0, 0, 0, 0));
                            break;
                    }
                    apiParams = { 
                        startDate: formatDate(startDate), 
                        endDate: formatDate(endDate) 
                    };
                }
                
                console.log("Enviando a la API:", apiParams);
                const response = await getDashboardData(apiParams);
                
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error(`Error al cargar datos:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [range, selectedDate]);


    // Datos para la gráfica de barras de ventas
    const salesBarChartData = {
        labels: stats?.salesData.map(d => new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })) || [],
        datasets: [{
            label: 'Ventas',
            data: stats?.salesData.map(d => d.total) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };
    
    // Opciones para la gráfica de barras de ventas
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
            datalabels: { display: false }
        }
    };

    // Datos para la gráfica de productos más vendidos
    const topProductsChartData = {
        labels: stats?.topProducts.map(p => p.name) || [],
        datasets: [{
            label: 'Unidades Vendidas',
            data: stats?.topProducts.map(p => p.quantity_sold) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };
    
    // Opciones para la gráfica horizontal de productos
    const topProductsChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: { display: false }
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
                        <StatCard icon={<FiPackage />} title="Total de Productos" value={stats.summary.totalProducts} />
                        
                        <StatCard 
                            icon={<FiDollarSign />} 
                            title={`Ventas de ${selectedDate ? 'la fecha seleccionada' : timeRangeLabels[range]}`} 
                            value={`$${new Intl.NumberFormat('es-CO').format(stats.summary.totalSales)}`} 
                            link="/supplier/stats/sales" 
                            linkText="Ver reporte de ventas" 
                        />
                        <StatCard icon={<FiList />} title="Pedidos Pendientes" value={stats.summary.pendingOrders} link="/supplier/orders" linkText="Gestionar pedidos" />
                        <StatCard icon={<FiAlertTriangle />} title="Productos con Bajo Stock" value={stats.summary.lowStockCount} link="/supplier/stats/low-stock" linkText="Ver inventario" />
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Resumen de Ingresos</h3>
                            {stats?.salesData && stats.salesData.length > 0 ? (
                                <div className="chart-container">
                                    <Bar options={salesBarChartOptions} data={salesBarChartData} />
                                </div>
                            ) : (
                                <div className="no-data-message">
                                    <p>No hay datos de ventas para este período.</p>
                                </div>
                            )}
                        </div>
                        <div className="chart-card">
                            <h3>Productos más vendidos</h3>
                            <div className="chart-container">
                                <Bar options={topProductsChartOptions} data={topProductsChartData} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierDashboardPage;