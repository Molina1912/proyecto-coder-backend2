import userModel from '../models/user.model.js';

export default class UsersDAO {
    
    
    async getAll() {
        return await userModel.find().lean();
    }
    
    
    async getById(id) {
        return await userModel.findById(id).lean();
    }
    
    
    async getByEmail(email) {
        return await userModel.findOne({ email }).lean();
    }
    
    
    async create(userData) {
        return await userModel.create(userData);
    }
    
    
    async update(id, userData) {
        return await userModel.findByIdAndUpdate(id, userData, { 
            new: true, 
            runValidators: true 
        }).lean();
    }
    
    
    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }
}