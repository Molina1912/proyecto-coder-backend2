// src/routes/tickets.router.js
import { Router } from 'express';
import * as ticketsController from '../controllers/tickets.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isUser } from '../middlewares/roles.middleware.js';

const router = Router();

// GET /api/tickets - Listar tickets (SOLO USUARIO)
router.get('/', 
    passportCall('current'),
    isUser,
    ticketsController.getAll
);

// GET /api/tickets/:tid - Obtener ticket por ID (SOLO USUARIO)
router.get('/:tid', 
    passportCall('current'),
    isUser,
    ticketsController.getById
);

export default router;