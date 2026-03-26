// src/dao/tickets.dao.js
import ticketModel from '../models/ticket.model.js';

export default class TicketsDAO {
    
    async getAll() {
        return await ticketModel.find().lean();
    }
    
    async getById(id) {
        return await ticketModel.findById(id).lean();
    }
    
    async getByCode(code) {
        return await ticketModel.findOne({ code }).lean();
    }
    
    async create(ticketData) {
        // ✅ El code se genera automáticamente en el modelo
        return await ticketModel.create(ticketData);
    }
    
    async delete(id) {
        return await ticketModel.findByIdAndDelete(id);
    }
}