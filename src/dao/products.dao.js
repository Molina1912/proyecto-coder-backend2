import productModel from '../models/product.model.js';

export default class ProductsDAO {
    
    async getAll({ limit = 10, page = 1, sort, query } = {}) {
        const filter = query ? { category: query } : {};
        const sortOption = sort ? { [sort]: 1 } : {};
        
        return await productModel.find(filter)
            .sort(sortOption)
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();
    }
    
    async getById(id) {
        return await productModel.findById(id).lean();
    }
    
    async create(productData) {
        return await productModel.create(productData);
    }
    
    async update(id, productData) {
        return await productModel.findByIdAndUpdate(id, productData, { 
            new: true, 
            runValidators: true 
        }).lean();
    }
    
    async delete(id) {
        return await productModel.findByIdAndDelete(id);
    }
    
    async reduceStock(productId, quantity) {
        return await productModel.findByIdAndUpdate(
            productId,
            { $inc: { stock: -quantity } },
            { new: true, runValidators: true }
        ).lean();
    }
    
    async checkStock(productId, quantity) {
        const product = await productModel.findById(productId);
        return product && product.stock >= quantity;
    }
}