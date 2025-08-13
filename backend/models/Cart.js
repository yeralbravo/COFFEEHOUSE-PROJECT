import db from '../config/db.js';

/**
 * Obtiene el carrito de un usuario, con los detalles completos de productos e insumos.
 * CORRECCIÓN: Se eliminaron las referencias a 'uuid' y se ajustó la lógica SQL.
 */
export const getCartByUserId = async (userId) => {
    try {
        const [rows] = await db.query(
            `
            SELECT 
                ci.id, ci.quantity,
                ci.product_id, ci.insumo_id,
                CASE WHEN ci.product_id IS NOT NULL THEN p.id ELSE i.id END AS item_id,
                CASE WHEN ci.product_id IS NOT NULL THEN p.nombre ELSE i.nombre END AS nombre,
                CASE WHEN ci.product_id IS NOT NULL THEN p.precio ELSE i.precio END AS precio,
                CASE WHEN ci.product_id IS NOT NULL THEN p.stock ELSE i.stock END AS stock,
                CASE WHEN ci.product_id IS NOT NULL THEN p.tipo ELSE i.categoria END AS tipo,
                CASE WHEN ci.product_id IS NOT NULL THEN p.marca ELSE i.marca END AS marca,
                CASE WHEN ci.product_id IS NOT NULL THEN 
                   (SELECT GROUP_CONCAT(pi.image_url) FROM product_images pi WHERE pi.product_id = p.id)
                ELSE 
                   (SELECT GROUP_CONCAT(ii.image_url) FROM insumo_images ii WHERE ii.insumo_id = i.id)
                END AS images
            FROM cart_items ci
            LEFT JOIN products p ON ci.product_id = p.id
            LEFT JOIN insumos i ON ci.insumo_id = i.id
            WHERE ci.user_id = ?
            `,
            [userId]
        );
        return rows.map(row => ({
            ...row,
            images: row.images ? row.images.split(',') : [],
            isProduct: !!row.product_id
        }));
    } catch (error) {
        console.error("Error al obtener el carrito por ID de usuario:", error);
        throw error;
    }
};

/**
 * Agrega un ítem al carrito de un usuario. Si ya existe, actualiza la cantidad.
 */
export const addItemToCart = async (userId, itemId, quantity, isProduct) => {
    try {
        const itemTypeColumn = isProduct ? 'product_id' : 'insumo_id';
        const [existingItem] = await db.query(
            `SELECT * FROM cart_items WHERE user_id = ? AND ${itemTypeColumn} = ?`,
            [userId, itemId]
        );

        if (existingItem.length > 0) {
            const [result] = await db.query(
                `UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND ${itemTypeColumn} = ?`,
                [quantity, userId, itemId]
            );
            return result;
        } else {
            const [result] = await db.query(
                `INSERT INTO cart_items (user_id, ${itemTypeColumn}, quantity) VALUES (?, ?, ?)`,
                [userId, itemId, quantity]
            );
            return result;
        }
    } catch (error) {
        console.error("Error al agregar ítem al carrito:", error);
        throw error;
    }
};

/**
 * Actualiza la cantidad de un ítem en el carrito.
 */
export const updateCartItemQuantity = async (userId, itemId, quantity, isProduct) => {
    try {
        const itemTypeColumn = isProduct ? 'product_id' : 'insumo_id';
        const [result] = await db.query(
            `UPDATE cart_items SET quantity = ? WHERE user_id = ? AND ${itemTypeColumn} = ?`,
            [quantity, userId, itemId]
        );
        return result;
    } catch (error) {
        console.error("Error al actualizar la cantidad del ítem en el carrito:", error);
        throw error;
    }
};

/**
 * Elimina un ítem del carrito.
 */
export const removeItemFromCart = async (userId, itemId, isProduct) => {
    try {
        const itemTypeColumn = isProduct ? 'product_id' : 'insumo_id';
        const [result] = await db.query(
            `DELETE FROM cart_items WHERE user_id = ? AND ${itemTypeColumn} = ?`,
            [userId, itemId]
        );
        return result;
    } catch (error) {
        console.error("Error al eliminar ítem del carrito:", error);
        throw error;
    }
};

/**
 * Vacía todo el carrito de un usuario.
 */
export const clearCartByUserId = async (userId) => {
    try {
        const [result] = await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
        return result;
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        throw error;
    }
};
