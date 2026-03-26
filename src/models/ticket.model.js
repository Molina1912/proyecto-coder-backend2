import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({

    code: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },

    purchase_datetime: { 
        type: Date, 
        default: Date.now,
        required: true 
    },

    amount: { 
        type: Number, 
        required: true,
        min: 0 
    },

    purchaser: { 
        type: String, 
        required: true,
        lowercase: true 
    }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);