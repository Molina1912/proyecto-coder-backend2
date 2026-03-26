// src/services/carts.service.js
import CartsDAO from '../dao/carts.dao.js';
import ProductsDAO from '../dao/products.dao.js';      // 🔹 NUEVO: Para manejar stock
import TicketsService from './tickets.service.js';      // 🔹 NUEVO: Para generar tickets

// 🔹 Instanciar DAOs y Services
const cartsDAO = new CartsDAO();
const productsDAO = new ProductsDAO();                  // 🔹 NUEVO
const ticketsService = new TicketsService();            // 🔹 NUEVO

export default class CartsService {
    
    // 🔹 Listar todos los carritos
    async getAll() {
        return await cartsDAO.getAll();
    }
    
    // 🔹 Obtener carrito por ID
    async getById(id) {
        return await cartsDAO.getById(id);
    }
    
    // 🔹 Crear carrito
    async create(userId) {
        return await cartsDAO.create({ owner: userId, products: [] });
    }
    
    // 🔹 Agregar producto al carrito
    async addProduct(cartId, productId, quantity = 1) {
        return await cartsDAO.addProduct(cartId, productId, quantity);
    }
    
    // 🔹 Eliminar producto del carrito
    async removeProduct(cartId, productId) {
        return await cartsDAO.removeProduct(cartId, productId);
    }
    
    // 🔹 Actualizar carrito
    async update(cartId, cartData) {
        return await cartsDAO.update(cartId, cartData);
    }
    
    // 🔹 Vaciar carrito
    async clearCart(cartId) {
        return await cartsDAO.clearCart(cartId);
    }
    
    // 🔹 🔥 LÓGICA DE COMPRA - Requisito clave de la entrega final
    // ✅ ESTE MÉTODO DEBE ESTAR DENTRO DE LA CLASE (antes del último })
    async purchase(cartId, userEmail) {
        // 1️⃣ Verificar que el carrito existe
        const cart = await cartsDAO.getById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        
        // 2️⃣ Verificar que no esté vacío
        if (!cart.products || cart.products.length === 0) {
            throw new Error('El carrito está vacío');
        }
        
        const purchasedProducts = [];
        const unprocessedProducts = [];
        let totalAmount = 0;
        
        // 3️⃣ Procesar cada producto del carrito
        for (const item of cart.products) {
            try {
                const product = item.product;
                const quantity = item.quantity;
                
                // 🔹 Verificar stock disponible
                if (!product || product.stock < quantity) {
                    unprocessedProducts.push({
                        productId: product?._id || item.product,
                        reason: product ? 'Stock insuficiente' : 'Producto no encontrado'
                    });
                    continue;
                }
                
                // 🔹 Restar stock del producto
                await productsDAO.reduceStock(product._id, quantity);
                
                // 🔹 Calcular subtotal
                const subtotal = product.price * quantity;
                totalAmount += subtotal;
                
                // ✅ Agregar a productos comprados
                purchasedProducts.push({
                    product: product.title,
                    productId: product._id,
                    quantity: quantity,
                    price: product.price,
                    subtotal: subtotal
                });
                
            } catch (error) {
                unprocessedProducts.push({
                    productId: item.product?._id || item.product,
                    reason: error.message
                });
                console.warn(`Error procesando producto: ${error.message}`);
            }
        }
        
        // 4️⃣ Generar ticket SOLO si hubo compras exitosas
        let ticket = null;
        if (purchasedProducts.length > 0 && totalAmount > 0) {
            ticket = await ticketsService.create({
                amount: totalAmount,
                purchaser: userEmail.toLowerCase()
            });
        }
        
        // 5️⃣ Actualizar carrito: dejar solo productos NO comprados
        if (unprocessedProducts.length > 0) {
            const remainingProducts = cart.products.filter(p => 
                unprocessedProducts.some(up => 
                    up.productId === p.product?._id?.toString() || 
                    up.productId === p.product?.toString()
                )
            );
            await cartsDAO.update(cartId, { products: remainingProducts });
        } else {
            await cartsDAO.clearCart(cartId);
        }
        
        // 6️⃣ Devolver resultado
        return {
            ticket,
            purchasedProducts,
            unprocessedProducts,
            totalAmount,
            message: unprocessedProducts.length > 0 
                ? 'Compra parcial completada' 
                : 'Compra completada exitosamente'
        };
    }
    
} 