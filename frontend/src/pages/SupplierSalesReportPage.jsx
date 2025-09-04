import React, { useState, useEffect, useCallback } from 'react';
import { FiDollarSign, FiShoppingBag, FiShoppingCart, FiHash } from 'react-icons/fi'; // 1. Cambiamos el ícono
import { getSalesReport } from '../services/supplierService';
import StatCard from '../components/supplier/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../style/SupplierDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

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

const SupplierSalesReportPage = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('month');
    const [selectedDate, setSelectedDate] = useState('');

    const fetchReport = useCallback(async () => {
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
            const response = await getSalesReport(apiParams);
            if (response.success) {
                setReport(response.data);
            }
        } catch (error) {
            console.error("Error al cargar el reporte de ventas", error);
        } finally {
            setLoading(false);
        }
    }, [range, selectedDate]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const revenueByTypeData = {
        labels: ['Cafés', 'Insumos'],
        datasets: [{
            data: [
                parseFloat(report?.revenueByType?.cafeRevenue) || 0,
                parseFloat(report?.revenueByType?.insumoRevenue) || 0
            ],
            backgroundColor: ['#24651C', '#82ca9d'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            datalabels: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = sum > 0 ? ((value / sum) * 100).toFixed(1) + '%' : '0%';
                        const formattedValue = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
                        return `${label}: ${formattedValue} (${percentage})`;
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
                            const sum = data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return data.labels.map((label, i) => {
                                const ds = data.datasets[0];
                                const value = ds.data[i];
                                const percentage = sum > 0 ? `(${(value / sum * 100).toFixed(1)}%)` : '';
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

    const revenueByCategoryData = {
        labels: report?.revenueByCategory.map(c => c.category) || [],
        datasets: [{
            label: 'Ingresos por Categoría',
            data: report?.revenueByCategory.map(c => c.totalRevenue) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };
    
    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                 callbacks: {
                    label: function(context) {
                        const value = context.parsed.x || 0;
                        return `Ingresos: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)}`;
                    }
                }
            },
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#ffffff',
                font: { weight: 'bold' },
                formatter: (value) => {
                    if (value < 1) return null; 
                    return new Intl.NumberFormat('es-CO', { 
                        style: 'currency', currency: 'COP', notation: 'compact' 
                    }).format(value)
                },
            }
        },
        scales: {
             x: {
                ticks: {
                    callback: (value) => new Intl.NumberFormat('es-CO', { notation: 'compact' }).format(value)
                }
            }
        }
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Reporte de Ventas</h1>
                <TimeRangeFilter
                    currentRange={range}
                    onRangeChange={setRange}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate} 
                />
            </header>

            {loading ? <p>Cargando reporte...</p> : report && (
                <>
                    <div className="stats-grid">
                        <StatCard icon={<FiDollarSign />} title="Ingresos Totales" value={`$${new Intl.NumberFormat('es-CO').format(report.summary.totalRevenue)}`} />
                        <StatCard icon={<FiShoppingBag />} title="Pedidos Totales" value={report.summary.totalOrders} />
                        <StatCard icon={<FiShoppingCart />} title="Productos Vendidos" value={report.summary.productsSold} />
                        
                        {/* --- 2. TARJETA ACTUALIZADA --- */}
                        <StatCard 
                            icon={<FiHash />} 
                            title="Promedio de Ítems por Pedido" 
                            value={report.summary.averageItemsPerOrder.toFixed(1)} 
                        />
                    </div>
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Ingresos por Tipo de Producto</h3>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Doughnut data={revenueByTypeData} options={doughnutOptions} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Ingresos por Categoría</h3>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Bar data={revenueByCategoryData} options={barOptions} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierSalesReportPage;