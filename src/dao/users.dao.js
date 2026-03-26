import userModel from '../models/user.model.js';

export default class UsersDAO {
    
    // Obtener todos los usuarios
    async getAll() {
        return await userModel.find().lean();
    }
    
    // Obtener usuario por ID
    async getById(id) {
        return await userModel.findById(id).lean();
    }
    
    // Obtener usuario por email
    async getByEmail(email) {
        return await userModel.findOne({ email }).lean();
    }
    
    // Crear usuario
    async create(userData) {
        return await userModel.create(userData);
    }
    
    // Actualizar usuario
    async update(id, userData) {
        return await userModel.findByIdAndUpdate(id, userData, { 
            new: true, 
            runValidators: true 
        }).lean();
    }
    
    // Eliminar usuario
    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }
}