// src/config/config.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔹 Cargar variables de entorno
dotenv.config({ path: './.env' });

/**
 * Configuración centralizada de la aplicación
 * Todas las variables sensibles se acceden desde aquí
 */
export default {
    // 🔹 Servidor
    port: parseInt(process.env.PORT) || 8080,
    env: process.env.NODE_ENV || 'development',
    
    // 🔹 MongoDB
    mongoUrl: process.env.MONGO_URI,
    
    // 🔹 JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '24h',
    
    // 🔹 Sesiones y Cookies
    sessionSecret: process.env.SESSION_SECRET,
    
    // 🔹 Configuración de Cookies (centralizada)
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // ✅ Solo HTTPS en prod
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000  // 24 horas en milisegundos
    },
    
    // 🔹 Email (Nodemailer - Unidad 8)
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    
    // 🔹 CORS (Frontend URL)
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    
    // 🔹 Helpers para verificar entorno
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    
    // 🔹 Validación de variables críticas (para desarrollo)
    validate: () => {
        const required = ['MONGO_URI', 'JWT_SECRET', 'SESSION_SECRET'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
            console.warn('⚠️ Variables de entorno faltantes:', missing.join(', '));
        }
    }
};