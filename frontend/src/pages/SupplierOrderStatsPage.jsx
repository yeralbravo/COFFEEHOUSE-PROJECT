import React, { useState, useEffect } from 'react';
import { FiFileText, FiClock, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { getOrderStats } from '../services/supplierService';
import StatCard from '../components/supplier/StatCard';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../style/SupplierDashboard.css';
import '../style/UserList.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const timeRangeOptions = {
    day: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año'
};

const SupplierOrderStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('month');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getOrderStats(range);
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error al cargar estadísticas de pedidos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [range]);

    const pieChartData = {
        labels: stats?.statusDistribution.map(s => s.status) || [],
        datasets: [{
            data: stats?.statusDistribution.map(s => s.count) || [],
            backgroundColor: ['#f5a623', '#4a90e2', '#28a745', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Estadísticas de Pedidos</h1>
                <div className="time-filters">
                    {Object.entries(timeRangeOptions).map(([key, label]) => (
                        <button key={key} onClick={() => setRange(key)} className={range === key ? 'active' : ''}>
                            {label}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? <p>Cargando estadísticas...</p> : stats && (
                <>
                    <div className="stats-grid">
                        <StatCard icon={<FiFileText />} title="Pedidos Totales" value={stats.summary.totalOrders} />
                        <StatCard icon={<FiClock />} title="Pedidos Pendientes" value={stats.summary.pending} />
                        <StatCard icon={<FiTruck />} title="Pedidos Enviados" value={stats.summary.shipped} />
                        <StatCard icon={<FiCheckCircle />} title="Pedidos Entregados" value={stats.summary.delivered} />
                    </div>
                    <div className="charts-grid">
                        <div className="chart-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <h3>Distribución por Estado</h3>
                            <Pie data={pieChartData} options={{ responsive: true }} />
                        </div>
                        <div className="chart-card">
                            <h3>Últimos Pedidos Recibidos</h3>
                            <div className="list-container">
                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>ID Pedido</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{order.user_name}</td>
                                                <td>{order.date}</td>
                                                <td>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</td>
                                                <td><span className={`role-badge role-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierOrderStatsPage;