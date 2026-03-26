// src/controllers/carts.controller.js
import CartsService from '../services/carts.service.js';

const cartsService = new CartsService();

// 🔹 Listar todos los carritos
export const getAll = async (req, res, next) => {
    try {
        const carts = await cartsService.getAll();
        res.json({ result: "success", payload: carts });
    } catch (error) {
        next(error);
    }
};

// 🔹 Obtener carrito por ID
export const getById = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.getById(cid);
        
        if (!cart) {
            return res.status(404).json({
                result: "error",
                message: "Carrito no encontrado"
            });
        }
        
        res.json({ result: "success", payload: cart });
    } catch (error) {
        next(error);
    }
};

// 🔹 Crear carrito
export const create = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                result: "error",
                message: "Usuario no autenticado"
            });
        }
        
        const cart = await cartsService.create(userId);
        
        res.status(201).json({
            result: "success",
            message: "Carrito creado correctamente",
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Agregar producto al carrito
export const addProduct = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;
        
        const cart = await cartsService.addProduct(cid, pid, quantity);
        
        if (!cart) {
            return res.status(404).json({
                result: "error",
                message: "Carrito no encontrado"
            });
        }
        
        res.json({
            result: "success",
            message: "Producto agregado al carrito",
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Eliminar producto del carrito
export const removeProduct = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsService.removeProduct(cid, pid);
        
        res.json({
            result: "success",
            message: "Producto eliminado del carrito",
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Actualizar carrito
export const update = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cartData = req.body;
        
        const cart = await cartsService.update(cid, cartData);
        
        res.json({
            result: "success",
            message: "Carrito actualizado",
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Vaciar carrito
export const clear = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsService.clearCart(cid);
        
        res.json({
            result: "success",
            message: "Carrito vaciado",
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 🔥 FINALIZAR COMPRA - Genera Ticket (REQUISITO CLAVE)
export const purchase = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const userEmail = req.user?.email;
        
        if (!userEmail) {
            return res.status(401).json({
                result: "error",
                message: "Usuario no autenticado"
            });
        }
        
        const result = await cartsService.purchase(cid, userEmail);
        
        res.json({
            result: "success",
            message: result.message,
            payload: {
                ticket: result.ticket,
                purchasedProducts: result.purchasedProducts,
                unprocessedProducts: result.unprocessedProducts,
                totalAmount: result.totalAmount
            }
        });
    } catch (error) {
        next(error);
    }
};