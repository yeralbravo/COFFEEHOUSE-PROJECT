import React, { useState, useEffect } from 'react';
import { FiPackage, FiCoffee, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { getProductStats } from '../services/supplierService';
import StatCard from '../components/supplier/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../style/SupplierDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const SupplierProductStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getProductStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error al cargar estadísticas de productos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const barChartData = {
        labels: ['Cafés', 'Insumos'],
        datasets: [{
            label: 'Cantidad de Ítems',
            data: [stats?.totalProducts || 0, stats?.totalInsumos || 0],
            backgroundColor: ['#24651C', '#3E7B27'],
            borderRadius: 5,
        }],
    };

    const doughnutChartData = {
        labels: ['En Stock', 'Bajo Stock', 'Agotado'],
        datasets: [{
            data: [
                (stats?.totalProducts + stats?.totalInsumos) - (stats?.lowStock + stats?.outOfStock) || 0,
                stats?.lowStock || 0,
                stats?.outOfStock || 0
            ],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 3,
            hoverOffset: 4,
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom',
            },
            datalabels: {
                formatter: (value, ctx) => {
                    const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = sum > 0 ? ((value / sum) * 100).toFixed(1) + '%' : '';
                    return percentage;
                },
                // --- CORRECCIÓN DE COLOR ---
                color: '#1f2937', // Un color oscuro y legible
                font: {
                    weight: 'bold',
                    size: 14,
                },
                textShadow: {
                    stroke: 'white',
                    color: 'white',
                    lineWidth: 2
                }
            },
        },
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Estadísticas de Productos</h1>
                <div className="time-filter-wrapper disabled">
                    <TimeRangeFilter
                        currentRange={range}
                        onRangeChange={setRange}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate} 
                    />
                </div>
            </header>

            {loading ? <p>Cargando estadísticas...</p> : stats && (
                <>
                    <div className="stats-grid">
                        <StatCard icon={<FiCoffee />} title="Total de Cafés" value={stats.totalProducts} />
                        <StatCard icon={<FiPackage />} title="Total de Insumos" value={stats.totalInsumos} />
                        <StatCard icon={<FiAlertTriangle />} title="Ítems con Bajo Stock" value={stats.lowStock} />
                        <StatCard icon={<FiXCircle />} title="Ítems Agotados" value={stats.outOfStock} />
                    </div>
                    <div className="charts-grid two-columns">
                        <div className="chart-card">
                            <h3>Distribución de Ítems</h3>
                            <div className="chart-container">
                                <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Estado del Inventario</h3>
                            <div className="chart-container">
                                <Doughnut data={doughnutChartData} options={doughnutOptions} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierProductStatsPage;