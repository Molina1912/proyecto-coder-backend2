import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateToken = (user) => {
    const token = jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            cart: user.cart,
            age: user.age
        },
        config.jwtSecret,
        { expiresIn: '24h' }
    );
    return token;
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        return decoded;
    } catch (error) {
        return null;
    }
};