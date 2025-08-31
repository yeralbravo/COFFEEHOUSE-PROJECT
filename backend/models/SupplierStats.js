import db from '../config/db.js';

export const getSupplierDashboardStats = async (supplierId, dateRange) => {
    const { startDate, endDate } = dateRange;
    const endDateWithTime = `${endDate} 23:59:59`;
    const startDateWithTime = `${startDate} 00:00:00`;
    
    // MODIFICADO: La subconsulta de 'pending_orders' ya NO incluye el filtro de fecha.
    const summaryQuery = `
        SELECT 
            (SELECT COUNT(*) FROM products WHERE supplier_id = ?) AS total_products,
            (SELECT COUNT(*) FROM insumos WHERE supplier_id = ?) AS total_insumos,
            (SELECT COUNT(*) FROM products WHERE supplier_id = ? AND stock <= 5) AS low_stock_products,
            (SELECT COUNT(*) FROM insumos WHERE supplier_id = ? AND stock <= 5) AS low_stock_insumos,
            (
                SELECT COUNT(DISTINCT o.id) 
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                WHERE o.status = 'Pendiente' AND 
                      (oi.product_id IN (SELECT id FROM products WHERE supplier_id = ?) OR 
                       oi.insumo_id IN (SELECT id FROM insumos WHERE supplier_id = ?))
                -- Se eliminó la línea "AND o.created_at BETWEEN ? AND ?" de esta subconsulta.
            ) AS pending_orders
    `;
    // MODIFICADO: Se eliminaron los dos últimos parámetros de fecha que correspondían a la subconsulta anterior.
    const [summaryResult] = await db.query(summaryQuery, [
        supplierId, supplierId, supplierId, supplierId, supplierId, supplierId
    ]);
    const summaryData = summaryResult[0];

    // --- El resto de las consultas SÍ usan el filtro de fecha ---
    const salesDataQuery = `
        SELECT 
            DATE(o.created_at) as date, 
            SUM(oi.quantity * oi.price_at_purchase) as total 
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE 
            (oi.product_id IN (SELECT id FROM products WHERE supplier_id = ?) OR 
             oi.insumo_id IN (SELECT id FROM insumos WHERE supplier_id = ?)) AND
            o.created_at BETWEEN ? AND ? AND
            o.status != 'Cancelado'
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
    `;
    const [salesData] = await db.query(salesDataQuery, [supplierId, supplierId, startDateWithTime, endDateWithTime]);
    
    const totalSales = salesData.reduce((sum, day) => sum + parseFloat(day.total), 0);

    const topProductsQuery = `
        SELECT 
            COALESCE(p.nombre, i.nombre) as name, 
            SUM(oi.quantity) as quantity_sold 
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN insumos i ON oi.insumo_id = i.id
        JOIN orders o ON oi.order_id = o.id
        WHERE 
            (p.supplier_id = ? OR i.supplier_id = ?) AND 
            o.created_at BETWEEN ? AND ? AND
            o.status != 'Cancelado'
        GROUP BY name 
        HAVING name IS NOT NULL
        ORDER BY quantity_sold DESC 
        LIMIT 5
    `;
    const [topProducts] = await db.query(topProductsQuery, [supplierId, supplierId, startDateWithTime, endDateWithTime]);

    return { 
        summary: { 
            totalProducts: parseInt(summaryData.total_products) + parseInt(summaryData.total_insumos), 
            lowStockCount: parseInt(summaryData.low_stock_products) + parseInt(summaryData.low_stock_insumos), 
            pendingOrders: parseInt(summaryData.pending_orders), 
            totalSales: totalSales 
        }, 
        salesData, 
        topProducts 
    };
};

export const getSupplierSalesReport = async (supplierId, dateRange) => {
    const { startDate, endDate } = dateRange;
    const [report] = await db.query( `SELECT COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS totalRevenue, COUNT(DISTINCT o.id) AS totalOrders, COALESCE(SUM(oi.quantity), 0) AS productsSold FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE (oi.product_id IN (SELECT id FROM products WHERE supplier_id = ?) OR oi.insumo_id IN (SELECT id FROM insumos WHERE supplier_id = ?)) AND o.created_at BETWEEN ? AND ? AND o.status != 'Cancelado'`, [supplierId, supplierId, `${startDate} 00:00:00`, `${endDate} 23:59:59`] );
    const [salesData] = await db.query( `SELECT DATE(o.created_at) as date, SUM(oi.quantity * oi.price_at_purchase) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE (oi.product_id IN (SELECT id FROM products WHERE supplier_id = ?) OR oi.insumo_id IN (SELECT id FROM insumos WHERE supplier_id = ?)) AND o.created_at BETWEEN ? AND ? AND o.status != 'Cancelado' GROUP BY DATE(o.created_at) ORDER BY date ASC`, [supplierId, supplierId, `${startDate} 00:00:00`, `${endDate} 23:59:59`] );
    const [topProducts] = await db.query( `SELECT IFNULL(p.nombre, i.nombre) as name, SUM(oi.quantity) as quantity_sold, SUM(oi.quantity * oi.price_at_purchase) as revenue FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id LEFT JOIN insumos i ON oi.insumo_id = i.id JOIN orders o ON oi.order_id = o.id WHERE (p.supplier_id = ? OR i.supplier_id = ?) AND o.created_at BETWEEN ? AND ? AND o.status != 'Cancelado' GROUP BY name HAVING name IS NOT NULL ORDER BY revenue DESC LIMIT 5`, [supplierId, supplierId, `${startDate} 00:00:00`, `${endDate} 23:59:59`] );
    const summary = report[0];
    summary.averageOrderValue = summary.totalOrders > 0 ? summary.totalRevenue / summary.totalOrders : 0;
    return { summary, salesData, topProducts };
};

export const getSupplierProductStats = async (supplierId) => {
    const [stats] = await db.query(
        `
        SELECT
            (SELECT COUNT(*) FROM products WHERE supplier_id = ?) AS product_count,
            (SELECT COUNT(*) FROM insumos WHERE supplier_id = ?) AS insumo_count,
            (SELECT COUNT(*) FROM products WHERE supplier_id = ? AND stock <= 5) + 
            (SELECT COUNT(*) FROM insumos WHERE supplier_id = ? AND stock <= 5) AS low_stock_count,
            (SELECT COUNT(*) FROM products WHERE supplier_id = ? AND stock = 0) + 
            (SELECT COUNT(*) FROM insumos WHERE supplier_id = ? AND stock = 0) AS out_of_stock_count
        `,
        [supplierId, supplierId, supplierId, supplierId, supplierId, supplierId]
    );

    return {
        totalProducts: parseInt(stats[0].product_count),
        totalInsumos: parseInt(stats[0].insumo_count),
        lowStock: parseInt(stats[0].low_stock_count),
        outOfStock: parseInt(stats[0].out_of_stock_count)
    };
};

export const getSupplierOrderStats = async (supplierId, dateRange) => {
    const { startDate, endDate } = dateRange;
    const supplierOrdersSubquery = `
        SELECT DISTINCT o.id 
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN insumos i ON oi.insumo_id = i.id
        WHERE (p.supplier_id = ? OR i.supplier_id = ?)
        AND o.created_at BETWEEN ? AND ?
    `;
    const [summary] = await db.query(
        `
        SELECT
            COUNT(*) AS total_orders,
            SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END) AS pending_count,
            SUM(CASE WHEN status = 'Enviado' THEN 1 ELSE 0 END) AS shipped_count,
            SUM(CASE WHEN status = 'Entregado' THEN 1 ELSE 0 END) AS delivered_count
        FROM orders
        WHERE id IN (${supplierOrdersSubquery})
        `,
        [supplierId, supplierId, `${startDate} 00:00:00`, `${endDate} 23:59:59`]
    );
    const [statusDistribution] = await db.query(
        `
        SELECT status, COUNT(*) as count
        FROM orders
        WHERE id IN (${supplierOrdersSubquery})
        GROUP BY status
        `,
        [supplierId, supplierId, `${startDate} 00:00:00`, `${endDate} 23:59:59`]
    );
    const [recentOrders] = await db.query(
        `
        SELECT o.id, u.nombre as user_name, o.total_amount, o.status, DATE_FORMAT(o.created_at, '%d/%m/%Y') as date
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id IN (${supplierOrdersSubquery})
        ORDER BY o.created_at DESC
        LIMIT 10
        `,
        [supplierId, supplierId, `${startDate} 00:00:00`, `${endDate} 23:59:59`]
    );

    return {
        summary: {
            totalOrders: parseInt(summary[0].total_orders) || 0,
            pending: parseInt(summary[0].pending_count) || 0,
            shipped: parseInt(summary[0].shipped_count) || 0,
            delivered: parseInt(summary[0].delivered_count) || 0,
        },
        statusDistribution,
        recentOrders
    };
};

export const getLowStockItems = async (supplierId) => {
    const [items] = await db.query(
        `
        (SELECT 
            id, nombre, stock, 'Café' as type,
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image
        FROM products p
        WHERE supplier_id = ? AND stock <= 5)
        
        UNION ALL

        (SELECT 
            id, nombre, stock, 'Insumo' as type,
            (SELECT image_url FROM insumo_images WHERE insumo_id = i.id LIMIT 1) as image
        FROM insumos i
        WHERE supplier_id = ? AND stock <= 5)

        ORDER BY stock ASC
        `,
        [supplierId, supplierId]
    );
    return items;
};