// src/controllers/tickets.controller.js
import TicketsService from '../services/tickets.service.js';

const ticketsService = new TicketsService();

// 🔹 Listar todos los tickets
export const getAll = async (req, res, next) => {
    try {
        const tickets = await ticketsService.getAll();
        res.json({ result: "success", payload: tickets });
    } catch (error) {
        next(error);
    }
};

// 🔹 Obtener ticket por ID
export const getById = async (req, res, next) => {
    try {
        const { tid } = req.params;
        const ticket = await ticketsService.getById(tid);
        
        if (!ticket) {
            return res.status(404).json({
                result: "error",
                message: "Ticket no encontrado"
            });
        }
        
        res.json({ result: "success", payload: ticket });
    } catch (error) {
        next(error);
    }
};