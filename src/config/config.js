import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: './.env' });


export default {
    
    port: parseInt(process.env.PORT) || 8080,
    env: process.env.NODE_ENV || 'Desarrollo',
    
  
    mongoUrl: process.env.MONGO_URI,
    
    
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '1h',
    
    
    sessionSecret: process.env.SESSION_SECRET,
    
    
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000  
    },
    
    
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    
    
    isDevelopment: process.env.NODE_ENV === 'Desarrollo',
    isProduction: process.env.NODE_ENV === 'production',
    
    
    validate: () => {
        const required = ['MONGO_URI', 'JWT_SECRET', 'SESSION_SECRET'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
            console.warn('⚠️ Variables de entorno faltantes:', missing.join(', '));
        }
    }
};