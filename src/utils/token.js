import crypto from 'crypto';

//token seguro para recuperación (expira en 1 hora)
export const generateRecoveryToken = (email) => {
    
    const random = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    return {
        token: crypto.createHash('sha256').update(`${email}-${timestamp}-${random}`).digest('hex'),
        expiresAt: new Date(timestamp + 60 * 60 * 1000)
    };
};


export const validateRecoveryToken = (token, storedToken, expiresAt) => {
    
    if (token !== storedToken) {
        return { valid: false, message: 'Token inválido' };
    }
    
    
    if (new Date() > new Date(expiresAt)) {
        return { valid: false, message: 'El enlace de recuperación ha expirado' };
    }
    
    return { valid: true };
};