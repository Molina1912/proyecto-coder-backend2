import ProductsService from '../services/products.service.js';

const productsService = new ProductsService();

export const getAll = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        const products = await productsService.getAll({ 
            limit: parseInt(limit), 
            page: parseInt(page), 
            sort, 
            query 
        });
        
        res.json({
            result: "success",
            payload: products
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productsService.getById(pid);
        
        if (!product) {
            return res.status(404).json({
                result: "error",
                message: "Producto no encontrado"
            });
        }
        
        res.json({
            result: "success",
            payload: product
        });
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const productData = req.body;
        const isAdmin = req.user.role === 'admin';
        
        const product = await productsService.create(productData, isAdmin);
        
        res.status(201).json({
            result: "success",
            message: "Producto creado correctamente",
            payload: product
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const productData = req.body;
        const isAdmin = req.user.role === 'admin';
        
        const product = await productsService.update(pid, productData, isAdmin);
        
        if (!product) {
            return res.status(404).json({
                result: "error",
                message: "Producto no encontrado"
            });
        }
        
        res.json({
            result: "success",
            message: "Producto actualizado correctamente",
            payload: product
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const isAdmin = req.user.role === 'admin';
        
        const product = await productsService.delete(pid, isAdmin);
        
        if (!product) {
            return res.status(404).json({
                result: "error",
                message: "Producto no encontrado"
            });
        }
        
        res.json({
            result: "success",
            message: "Producto eliminado correctamente",
            payload: product
        });
    } catch (error) {
        next(error);
    }
};