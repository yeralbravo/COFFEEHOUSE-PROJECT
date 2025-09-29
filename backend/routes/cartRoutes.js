import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getCartByUserId, addItemToCart, updateCartItemQuantity, removeItemFromCart, clearCartByUserId, removeMultipleItemsFromCart } from '../models/Cart.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const cart = await getCartByUserId(req.user.id);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener el carrito.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { itemId, quantity, isProduct } = req.body;
    try {
        await addItemToCart(req.user.id, itemId, quantity, isProduct);
        res.status(201).json({ success: true, message: 'Ítem agregado al carrito.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al agregar ítem al carrito.' });
    }
});

router.put('/', verifyToken, async (req, res) => {
    const { itemId, quantity, isProduct } = req.body;
    try {
        await updateCartItemQuantity(req.user.id, itemId, quantity, isProduct);
        res.status(200).json({ success: true, message: 'Cantidad actualizada.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al actualizar la cantidad.' });
    }
});

router.delete('/', verifyToken, async (req, res) => {
    const { itemId, isProduct } = req.body;
    try {
        await removeItemFromCart(req.user.id, itemId, isProduct);
        res.status(200).json({ success: true, message: 'Ítem eliminado del carrito.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al eliminar el ítem.' });
    }
});

router.delete('/clear', verifyToken, async (req, res) => {
    try {
        await clearCartByUserId(req.user.id);
        res.status(200).json({ success: true, message: 'Carrito vaciado.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al vaciar el carrito.' });
    }
});

// --- NUEVA RUTA AÑADIDA ---
router.post('/remove-items', verifyToken, async (req, res) => {
    try {
        const { itemIds } = req.body; // Esperamos un array de IDs de cart_items
        if (!Array.isArray(itemIds)) {
            return res.status(400).json({ success: false, error: 'Se esperaba un array de IDs.' });
        }
        await removeMultipleItemsFromCart(req.user.id, itemIds);
        res.status(200).json({ success: true, message: 'Ítems comprados eliminados del carrito.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al limpiar ítems del carrito.' });
    }
});

export default router;