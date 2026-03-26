import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Generar token
export const generateToken = (user) => {
    const token = jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            role: user.role 
        },
        config.jwtSecret,
        { expiresIn: '24h' }
    );
    return token;
};

// Verificar token
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        return decoded;
    } catch (error) {
        return null;
    }
};