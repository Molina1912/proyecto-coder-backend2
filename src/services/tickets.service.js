import TicketsDAO from '../dao/tickets.dao.js';

const ticketsDAO = new TicketsDAO();

export default class TicketsService {
    
    async getAll() {
        return await ticketsDAO.getAll();
    }
    
    async getById(id) {
        return await ticketsDAO.getById(id);
    }
    
    async getByCode(code) {
        return await ticketsDAO.getByCode(code);
    }
    
    async create(ticketData) {
        
        return await ticketsDAO.create({
            ...ticketData,
            purchase_datetime: new Date() 
        });
    }
    
    async delete(id) {
        return await ticketsDAO.delete(id);
    }
}