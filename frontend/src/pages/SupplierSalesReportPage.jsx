import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import { getSalesReport } from '../services/supplierService';
import StatCard from '../components/supplier/StatCard';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../style/SupplierDashboard.css'; // Reutilizamos estilos

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const timeRangeOptions = {
    day: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año'
};

const SupplierSalesReportPage = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('month');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const response = await getSalesReport(range);
                if (response.success) {
                    setReport(response.data);
                }
            } catch (error) {
                console.error("Error al cargar el reporte de ventas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [range]);

    const lineChartData = {
        labels: report?.salesData.map(d => new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })) || [],
        datasets: [{
            label: 'Ventas',
            data: report?.salesData.map(d => d.total) || [],
            borderColor: '#24651C',
            backgroundColor: 'rgba(36, 101, 28, 0.1)',
            fill: true,
            tension: 0.3,
        }],
    };

    const barChartData = {
        labels: report?.topProducts.map(p => p.name) || [],
        datasets: [{
            label: 'Ingresos por Producto',
            data: report?.topProducts.map(p => p.revenue) || [],
            backgroundColor: '#3E7B27',
            borderRadius: 5,
        }],
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Reporte de Ventas</h1>
                <div className="time-filters">
                    {Object.entries(timeRangeOptions).map(([key, label]) => (
                        <button key={key} onClick={() => setRange(key)} className={range === key ? 'active' : ''}>
                            {label}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? <p>Cargando reporte...</p> : report && (
                <>
                    <div className="stats-grid">
                        <StatCard icon={<FiDollarSign />} title="Ingresos Totales" value={`$${new Intl.NumberFormat('es-CO').format(report.summary.totalRevenue)}`} />
                        <StatCard icon={<FiShoppingBag />} title="Pedidos Totales" value={report.summary.totalOrders} />
                        <StatCard icon={<FiShoppingCart />} title="Productos Vendidos" value={report.summary.productsSold} />
                        <StatCard icon={<FiTrendingUp />} title="Valor Promedio Pedido" value={`$${new Intl.NumberFormat('es-CO').format(report.summary.averageOrderValue)}`} />
                    </div>
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Ventas a lo largo del tiempo</h3>
                            <Line data={lineChartData} />
                        </div>
                        <div className="chart-card">
                            <h3>Top 5 Productos por Ingresos</h3>
                            <Bar data={barChartData} options={{ indexAxis: 'y' }} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierSalesReportPage;