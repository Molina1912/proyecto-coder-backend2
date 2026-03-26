import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    age: { type: Number, min: 0 },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'admin' 
    },
    
    
    recoveryToken: { type: String, default: null },
    recoveryTokenExpires: { type: Date, default: null }
    
}, { timestamps: true });

export default mongoose.model('User', userSchema);