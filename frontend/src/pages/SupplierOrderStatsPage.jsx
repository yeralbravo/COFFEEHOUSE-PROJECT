import React, { useState, useEffect, useCallback } from 'react';
import { FiFileText, FiClock, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { getOrderStats } from '../services/supplierService';
import StatCard from '../components/supplier/StatCard';
import TimeRangeFilter from '../components/TimeRangeFilter';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../style/SupplierDashboard.css';
import '../style/UserList.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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

const SupplierOrderStatsPage = () => {
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
            const response = await getOrderStats(apiParams);
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error al cargar estadísticas de pedidos", error);
        } finally {
            setLoading(false);
        }
    }, [range, selectedDate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const customerTypeChartData = {
        labels: ['Clientes Nuevos', 'Clientes Recurrentes'],
        datasets: [{
            data: [
                stats?.customerTypeStats?.new_customer_orders || 0,
                stats?.customerTypeStats?.returning_customer_orders || 0
            ],
            backgroundColor: ['#24651C', '#82ca9d'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };

    // --- OPCIONES IDÉNTICAS A LA PÁGINA DE VENTAS ---
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
                        return `${label}: ${value} pedidos (${percentage})`;
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
                                const formattedValue = `${value}`; // Se muestra el número de pedidos
                                
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

    return (
        <div className="supplier-dashboard-container">
            <header className="dashboard-header">
                <h1>Estadísticas de Pedidos</h1>
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
                        <StatCard icon={<FiFileText />} title="Pedidos Totales" value={stats.summary.totalOrders} />
                        <StatCard icon={<FiClock />} title="Pedidos Pendientes" value={stats.summary.pending} />
                        <StatCard icon={<FiTruck />} title="Pedidos Enviados" value={stats.summary.shipped} />
                        <StatCard icon={<FiCheckCircle />} title="Pedidos Entregados" value={stats.summary.delivered} />
                    </div>
                    <div className="charts-grid two-columns">
                        <div className="chart-card">
                            <h3>Pedidos por Tipo de Cliente</h3>
                            <div className="chart-container">
                                {stats?.customerTypeStats && (stats.customerTypeStats.new_customer_orders > 0 || stats.customerTypeStats.returning_customer_orders > 0) ? (
                                    <Doughnut data={customerTypeChartData} options={doughnutOptions} />
                                ) : (
                                    <div className="no-data-message">
                                        <p>No hay pedidos en este período para mostrar la gráfica.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="chart-card centered-table-card">
                            <h3>Últimos 5 Pedidos Recibidos</h3>
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
                                        {stats.recentOrders.length > 0 ? stats.recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{order.user_name}</td>
                                                <td>{order.date}</td>
                                                <td>${new Intl.NumberFormat('es-CO').format(order.total_amount)}</td>
                                                <td><span className={`role-badge role-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" style={{textAlign: 'center', padding: '1rem'}}>No hay pedidos recientes en este período.</td>
                                            </tr>
                                        )}
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