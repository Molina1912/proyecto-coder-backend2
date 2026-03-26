import CartsDAO from '../dao/carts.dao.js';
import ProductsDAO from '../dao/products.dao.js';      
import TicketsService from './tickets.service.js';      


const cartsDAO = new CartsDAO();
const productsDAO = new ProductsDAO();                  
const ticketsService = new TicketsService();            

export default class CartsService {
    
    
    async getAll() {
        return await cartsDAO.getAll();
    }
    
    
    async getById(id) {
        return await cartsDAO.getById(id);
    }
    
    
    async create(userId) {
        return await cartsDAO.create({ owner: userId, products: [] });
    }
    
    
    async addProduct(cartId, productId, quantity = 1) {
        return await cartsDAO.addProduct(cartId, productId, quantity);
    }
    
    
    async removeProduct(cartId, productId) {
        return await cartsDAO.removeProduct(cartId, productId);
    }
    
    
    async update(cartId, cartData) {
        return await cartsDAO.update(cartId, cartData);
    }
    
    
    async clearCart(cartId) {
        return await cartsDAO.clearCart(cartId);
    }
    

    async purchase(cartId, userEmail) {
        
        const cart = await cartsDAO.getById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        
        
        if (!cart.products || cart.products.length === 0) {
            throw new Error('El carrito está vacío');
        }
        
        const purchasedProducts = [];
        const unprocessedProducts = [];
        let totalAmount = 0;
        
        
        for (const item of cart.products) {
            try {
                const product = item.product;
                const quantity = item.quantity;
                
               
                if (!product || product.stock < quantity) {
                    unprocessedProducts.push({
                        productId: product?._id || item.product,
                        reason: product ? 'Stock insuficiente' : 'Producto no encontrado'
                    });
                    continue;
                }
                
                
                await productsDAO.reduceStock(product._id, quantity);
                
                
                const subtotal = product.price * quantity;
                totalAmount += subtotal;
                
               
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
        
        
        let ticket = null;
        if (purchasedProducts.length > 0 && totalAmount > 0) {
            ticket = await ticketsService.create({
                amount: totalAmount,
                purchaser: userEmail.toLowerCase()
            });
        }
        
        
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