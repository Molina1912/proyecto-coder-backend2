// src/models/ticket.model.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    // 🔹 Código único autogenerado (Requisito clave)
    code: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
    // 🔹 Fecha y hora exacta de la compra
    purchase_datetime: { 
        type: Date, 
        default: Date.now,
        required: true 
    },
    // 🔹 Monto total de la compra
    amount: { 
        type: Number, 
        required: true,
        min: 0 
    },
    // 🔹 Email del usuario que compró
    purchaser: { 
        type: String, 
        required: true,
        lowercase: true 
    }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);