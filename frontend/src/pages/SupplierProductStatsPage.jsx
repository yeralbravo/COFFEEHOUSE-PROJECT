import React, { useState, useEffect } from 'react';
import { FiPackage, FiCoffee, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { getProductStats } from '../services/supplierService';
import StatCard from '../components/supplier/StatCard';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import '../style/SupplierDashboard.css'; // Reutilizamos estilos

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const SupplierProductStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const pieChartData = {
        labels: ['En Stock', 'Bajo Stock', 'Agotado'],
        datasets: [{
            data: [
                (stats?.totalProducts + stats?.totalInsumos) - (stats?.lowStock + stats?.outOfStock) || 0,
                stats?.lowStock || 0,
                stats?.outOfStock || 0
            ],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Estadísticas de Productos</h1>
            </header>

            {loading ? <p>Cargando estadísticas...</p> : stats && (
                <>
                    <div className="stats-grid">
                        <StatCard icon={<FiCoffee />} title="Total de Cafés" value={stats.totalProducts} />
                        <StatCard icon={<FiPackage />} title="Total de Insumos" value={stats.totalInsumos} />
                        <StatCard icon={<FiAlertTriangle />} title="Ítems con Bajo Stock" value={stats.lowStock} />
                        <StatCard icon={<FiXCircle />} title="Ítems Agotados" value={stats.outOfStock} />
                    </div>
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Distribución de Ítems</h3>
                            <Bar data={barChartData} options={{ responsive: true }} />
                        </div>
                        <div className="chart-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <h3>Estado del Inventario</h3>
                            <Pie data={pieChartData} options={{ responsive: true }} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierProductStatsPage;