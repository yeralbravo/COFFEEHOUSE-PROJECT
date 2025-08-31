import express from 'express';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';
import { 
    getSupplierDashboardStats, 
    getSupplierSalesReport, 
    getSupplierProductStats, 
    getSupplierOrderStats,
    getLowStockItems 
} from '../models/SupplierStats.js';

const router = express.Router();

// --- RUTA DE ESTADÍSTICAS DEL DASHBOARD ---
router.get('/stats', [verifyToken, checkRole(['supplier'])], async (req, res) => {
    try {
        const supplierId = req.user.id;
        // MODIFICADO: Leemos los nuevos parámetros de fecha de la URL
        const { startDate, endDate } = req.query;

        // Validación para asegurar que las fechas se envíen
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, error: 'Se requieren parámetros startDate y endDate.' });
        }
        
        // MODIFICADO: Pasamos un objeto con las fechas al modelo en lugar de 'range'
        const stats = await getSupplierDashboardStats(supplierId, { startDate, endDate });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Error al obtener estadísticas del proveedor:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
});

// --- RUTA DEL REPORTE DE VENTAS ---
router.get('/sales-report', [verifyToken, checkRole(['supplier'])], async (req, res) => {
    try {
        const supplierId = req.user.id;
        // MODIFICADO: Leemos los nuevos parámetros de fecha
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, error: 'Se requieren parámetros startDate y endDate.' });
        }
        
        // MODIFICADO: Pasamos el objeto de fechas al modelo
        const report = await getSupplierSalesReport(supplierId, { startDate, endDate });
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error("Error al obtener el reporte de ventas:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
});

// --- RUTA DE ESTADÍSTICAS DE PRODUCTOS (Sin cambios, no usa filtro de fecha) ---
router.get('/product-stats', [verifyToken, checkRole(['supplier'])], async (req, res) => {
    try {
        const supplierId = req.user.id;
        const stats = await getSupplierProductStats(supplierId);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Error al obtener estadísticas de productos:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
});

// --- RUTA DE ESTADÍSTICAS DE PEDIDOS ---
router.get('/order-stats', [verifyToken, checkRole(['supplier'])], async (req, res) => {
    try {
        const supplierId = req.user.id;
        // MODIFICADO: Leemos los nuevos parámetros de fecha
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, error: 'Se requieren parámetros startDate y endDate.' });
        }

        // MODIFICADO: Pasamos el objeto de fechas al modelo
        const stats = await getSupplierOrderStats(supplierId, { startDate, endDate });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Error al obtener estadísticas de pedidos:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
});

// --- RUTA DE ÍTEMS CON BAJO STOCK (Sin cambios, no usa filtro de fecha) ---
router.get('/low-stock-items', [verifyToken, checkRole(['supplier'])], async (req, res) => {
    try {
        const supplierId = req.user.id;
        const items = await getLowStockItems(supplierId);
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        console.error("Error al obtener ítems con bajo stock:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
});

export default router;