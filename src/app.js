import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config/config.js';
import { initializePassport } from './config/passport.config.js';


import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ticketsRouter from './routes/tickets.router.js';

const app = express();


config.validate();


app.use(cors({
    origin: config.frontendUrl,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.sessionSecret));


initializePassport();


app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketsRouter);


app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: '🎓 Backend Coderhouse - Entrega Final',
        version: '1.0.0',
        environment: config.env,
        endpoints: {
            auth: {
                register: 'POST /api/sessions/register',
                login: 'POST /api/sessions/login',
                current: 'GET /api/sessions/current (JWT protegida)',
                logout: 'POST /api/sessions/logout',
                recover: 'POST /api/sessions/recover-password',
                reset: 'POST /api/sessions/reset-password'
            },
            products: 'GET/POST/PUT/DELETE /api/products',
            carts: 'GET/POST/PUT/DELETE /api/carts',
            purchase: 'POST /api/carts/:cid/purchase',
            tickets: 'GET /api/tickets'
        }
    });
});


app.use((error, req, res, next) => {
    console.error('Error:', error.message);


    if (error.name === 'ValidationError') {
        return res.status(400).json({
            result: "error",
            message: "Datos inválidos",
            details: Object.values(error.errors).map(e => e.message)
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            result: "error",
            message: "ID de recurso inválido"
        });
    }


    res.status(error.status || 500).json({
        result: "error",
        message: config.isProduction
            ? "Error interno del servidor"
            : error.message
    });
});


const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log('Conectado a la Base de Datos OK');
    } catch (error) {
        console.error('Error en la Base de Datos:', error.message);

    }
};
connectDB();


app.listen(config.port, () => {
    console.log(`Servidor en http://localhost:${config.port}`);
    console.log(`Entorno: ${config.env}`);
    console.log(`Cookie secure: ${config.cookie.secure}`);
});

export default app;