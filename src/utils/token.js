// src/utils/token.js
import crypto from 'crypto';

// 🔹 Generar token seguro para recuperación (expira en 1 hora)
export const generateRecoveryToken = (email) => {
    // Token único basado en email + timestamp + random
    const random = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    return {
        token: crypto.createHash('sha256').update(`${email}-${timestamp}-${random}`).digest('hex'),
        expiresAt: new Date(timestamp + 60 * 60 * 1000) // 1 hora en milisegundos
    };
};

// 🔹 Verificar si el token es válido y no ha expirado
export const validateRecoveryToken = (token, storedToken, expiresAt) => {
    // Verificar que el token coincida
    if (token !== storedToken) {
        return { valid: false, message: 'Token inválido' };
    }
    
    // Verificar que no haya expirado
    if (new Date() > new Date(expiresAt)) {
        return { valid: false, message: 'El enlace de recuperación ha expirado' };
    }
    
    return { valid: true };
};