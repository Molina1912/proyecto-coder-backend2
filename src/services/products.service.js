// src/services/products.service.js
import ProductsDAO from '../dao/products.dao.js';

const productsDAO = new ProductsDAO();

export default class ProductsService {
    
    async getAll(filters) {
        return await productsDAO.getAll(filters);
    }
    
    async getById(id) {
        return await productsDAO.getById(id);
    }
    
    async create(productData, isAdmin = false) {
        // 🔹 Solo admin puede crear productos
        if (!isAdmin) {
            throw new Error('Solo administradores pueden crear productos');
        }
        
        // 🔹 Verificar que el código sea único
        const existing = await productsDAO.getAll({ query: productData.code });
        if (existing.some(p => p.code === productData.code)) {
            throw new Error('El código de producto ya existe');
        }
        
        return await productsDAO.create(productData);
    }
    
    async update(id, productData, isAdmin = false) {
        if (!isAdmin) {
            throw new Error('Solo administradores pueden actualizar productos');
        }
        return await productsDAO.update(id, productData);
    }
    
    async delete(id, isAdmin = false) {
        if (!isAdmin) {
            throw new Error('Solo administradores pueden eliminar productos');
        }
        return await productsDAO.delete(id);
    }
    
    // 🔹 Lógica de negocio: verificar stock antes de compra
    async checkAvailability(productId, quantity) {
        const hasStock = await productsDAO.checkStock(productId, quantity);
        if (!hasStock) {
            throw new Error('Stock insuficiente para este producto');
        }
        return true;
    }
    
    // 🔹 Procesar compra: reducir stock
    async processPurchase(productId, quantity) {
        await this.checkAvailability(productId, quantity);
        return await productsDAO.reduceStock(productId, quantity);
    }
}