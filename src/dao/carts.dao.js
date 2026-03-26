import cartModel from '../models/cart.model.js';

export default class CartsDAO {
    
    async getAll() {
        return await cartModel.find().populate('products.product').lean();
    }
    
    async getById(id) {
        return await cartModel.findById(id)
            .populate('products.product')
            .populate('owner')
            .lean();
    }
    
    async create(cartData) {
        return await cartModel.create(cartData);
    }
    
    async update(id, cartData) {
        return await cartModel.findByIdAndUpdate(id, cartData, { 
            new: true, 
            runValidators: true 
        }).lean();
    }
    
    async delete(id) {
        return await cartModel.findByIdAndDelete(id);
    }
    
    async addProduct(cartId, productId, quantity = 1) {
        const cart = await cartModel.findById(cartId);
        
        if (!cart) return null;
        
        const existingProduct = cart.products.find(
            p => p.product.toString() === productId
        );
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        
        return await cart.save();
    }
    
    async removeProduct(cartId, productId) {
        return await cartModel.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }
        ).populate('products.product').lean();
    }
    
    async clearCart(cartId) {
        return await cartModel.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        ).lean();
    }
}