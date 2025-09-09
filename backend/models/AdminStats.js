import db from '../config/db.js';

const getDateRangeQuery = (range, dateColumn) => {
    switch (range) {
        case 'day':
            return ` AND DATE(${dateColumn}) = CURDATE()`;
        case 'week':
            return ` AND YEARWEEK(${dateColumn}, 1) = YEARWEEK(CURDATE(), 1)`;
        // --- CORRECCIÓN FINAL ---
        case 'month':
            // Ahora establece un rango entre el primer día del mes y el momento actual.
            return ` AND ${dateColumn} BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND NOW()`;
        case 'year':
            return ` AND ${dateColumn} >= DATE_FORMAT(CURDATE(), '%Y-01-01')`;
        default:
            return ''; // Para 'all' o 'Histórico'
    }
};

export const getAdminDashboardStats = async (filters) => {
    const { range, startDate, endDate } = filters;

    let dateFilter;
    let userDateFilter;

    if (startDate && endDate) {
        const startDateWithTime = `${startDate} 00:00:00`;
        const endDateWithTime = `${endDate} 23:59:59`;
        dateFilter = ` AND o.created_at BETWEEN '${startDateWithTime}' AND '${endDateWithTime}'`;
        userDateFilter = ` AND created_at BETWEEN '${startDateWithTime}' AND '${endDateWithTime}'`;
    } else {
        dateFilter = getDateRangeQuery(range, 'o.created_at');
        userDateFilter = getDateRangeQuery(range, 'created_at');
    }

    const kpiQuery = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'client' ${userDateFilter}) as new_users,
            (SELECT COUNT(DISTINCT id) FROM orders o WHERE 1=1 ${dateFilter}) as total_orders,
            (SELECT SUM(total_amount) FROM orders o WHERE 1=1 ${dateFilter}) as total_revenue,
            (SELECT COUNT(*) FROM supplier_requests WHERE status = 'pending') as pending_suppliers
    `;
    const [kpiResult] = await db.query(kpiQuery);

    const salesOverTimeQuery = `
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, SUM(total_amount) as total
        FROM orders o
        WHERE 1=1 ${dateFilter}
        GROUP BY date
        ORDER BY date ASC
    `;
    const [salesData] = await db.query(salesOverTimeQuery);

    const topProductsQuery = `
        SELECT
            COALESCE(p.nombre, i.nombre) AS nombre,
            SUM(oi.quantity) AS quantity_sold
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN insumos i ON oi.insumo_id = i.id
        WHERE
            COALESCE(p.nombre, i.nombre) IS NOT NULL
            ${dateFilter}
        GROUP BY
            nombre
        ORDER BY
            quantity_sold DESC
        LIMIT 5
    `;
    const [topProducts] = await db.query(topProductsQuery);

    const userDistributionQuery = `
        SELECT role, COUNT(*) as count FROM users GROUP BY role;
    `;
    const [userDistribution] = await db.query(userDistributionQuery);
    
    const topSuppliersQuery = `
        SELECT
            CONCAT(u.nombre, ' ', u.apellido) as supplier_name,
            SUM(oi.quantity * oi.price_at_purchase) as total_revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN insumos i ON oi.insumo_id = i.id
        JOIN users u ON u.id = COALESCE(p.supplier_id, i.supplier_id)
        WHERE
            COALESCE(p.supplier_id, i.supplier_id) IS NOT NULL
            ${dateFilter}
        GROUP BY
            u.id, supplier_name
        ORDER BY
            total_revenue DESC
        LIMIT 5
    `;
    const [topSuppliers] = await db.query(topSuppliersQuery);

    const orderStatusQuery = `
        SELECT status, COUNT(*) as count
        FROM orders o
        WHERE 1=1 ${dateFilter}
        GROUP BY status
    `;
    const [orderStatusDistribution] = await db.query(orderStatusQuery);

    return {
        kpis: {
            newUsers: kpiResult[0].new_users || 0,
            totalOrders: kpiResult[0].total_orders || 0,
            totalRevenue: kpiResult[0].total_revenue || 0,
            pendingSuppliers: kpiResult[0].pending_suppliers || 0,
        },
        salesOverTime: salesData,
        topProducts,
        userDistribution,
        topSuppliers,
        orderStatusDistribution
    };
};

export const getSalesStats = async (filters) => {
    const { range, startDate, endDate } = filters;

    let dateFilter;
    if (startDate && endDate) {
        const startDateWithTime = `${startDate} 00:00:00`;
        const endDateWithTime = `${endDate} 23:59:59`;
        dateFilter = ` AND o.created_at BETWEEN '${startDateWithTime}' AND '${endDateWithTime}'`;
    } else {
        dateFilter = getDateRangeQuery(range, 'o.created_at');
    }
    
    const kpiQuery = `
        SELECT
            COALESCE(SUM(total_amount), 0) as totalRevenue,
            COUNT(*) as totalOrders,
            (SELECT SUM(oi.quantity) FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE 1=1 ${dateFilter}) as totalItemsSold
        FROM orders o
        WHERE 1=1 ${dateFilter}
    `;
    const [kpis] = await db.query(kpiQuery);

    const recurringCustomersQuery = `
        SELECT COUNT(*) AS recurringCustomers
        FROM (
            SELECT user_id
            FROM orders
            GROUP BY user_id
            HAVING COUNT(id) > 1
        ) AS recurring_users
    `;
    const [recurringResult] = await db.query(recurringCustomersQuery);

    kpis[0].recurringCustomers = recurringResult[0].recurringCustomers;

    const paymentMethodQuery = `
        SELECT 
            payment_method, 
            SUM(total_amount) as total 
        FROM orders o
        WHERE 1=1 ${dateFilter} AND payment_method IS NOT NULL
        GROUP BY payment_method
    `;
    const [paymentMethodStats] = await db.query(paymentMethodQuery);

    const locationRevenueQuery = `
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(shipping_address, '$.ciudad')) AS ciudad,
            SUM(total_amount) as total
        FROM orders o
        WHERE JSON_UNQUOTE(JSON_EXTRACT(shipping_address, '$.ciudad')) IS NOT NULL ${dateFilter}
        GROUP BY ciudad
        ORDER BY total DESC
        LIMIT 7
    `;
    const [locationRevenueStats] = await db.query(locationRevenueQuery);
    
    return { 
        kpis: kpis[0], 
        paymentMethodStats,
        locationRevenueStats
    };
};

export const getProductStats = async (range = 'month') => {
    const dateFilter = getDateRangeQuery(range, 'o.created_at');
    const topProductsQuery = `
        SELECT p.nombre, SUM(oi.quantity) as quantity_sold, SUM(oi.quantity * oi.price_at_purchase) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE p.nombre IS NOT NULL ${dateFilter}
        GROUP BY p.nombre ORDER BY revenue DESC LIMIT 10;
    `;
    const [topProducts] = await db.query(topProductsQuery);

    const stockStatusQuery = `
        SELECT 
            SUM(CASE WHEN stock > 10 THEN 1 ELSE 0 END) as in_stock,
            SUM(CASE WHEN stock > 0 AND stock <= 10 THEN 1 ELSE 0 END) as low_stock,
            SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock
        FROM (SELECT stock FROM products UNION ALL SELECT stock FROM insumos) as all_items;
    `;
    const [stockStatus] = await db.query(stockStatusQuery);

    return { topProducts, stockStatus: stockStatus[0] };
};

export const getUserStats = async (range = 'month') => {
    const userDateFilter = getDateRangeQuery(range, 'created_at');
    const newUsersQuery = `
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count
        FROM users
        WHERE role = 'client' ${userDateFilter}
        GROUP BY date ORDER BY date ASC;
    `;
    const [newUsersOverTime] = await db.query(newUsersOverTime);
    
    const userDistributionQuery = `SELECT role, COUNT(*) as count FROM users GROUP BY role;`;
    const [userDistribution] = await db.query(userDistributionQuery);

    return { newUsersOverTime, userDistribution };
};

export const getOrderStats = async (range = 'month') => {
    const dateFilter = getDateRangeQuery(range, 'created_at');
    const ordersOverTimeQuery = `
        SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count
        FROM orders
        WHERE 1=1 ${dateFilter}
        GROUP BY date ORDER BY date ASC;
    `;
    const [ordersOverTime] = await db.query(ordersOverTimeQuery);

    const orderStatusQuery = `SELECT status, COUNT(*) as count FROM orders WHERE 1=1 ${dateFilter} GROUP BY status;`;
    const [orderStatusDistribution] = await db.query(orderStatusDistribution);

    return { ordersOverTime, orderStatusDistribution };
};