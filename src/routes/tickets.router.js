import { Router } from 'express';
import * as ticketsController from '../controllers/tickets.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isUser } from '../middlewares/roles.middleware.js';

const router = Router();

router.get('/', 
    passportCall('current'),
    isUser,
    ticketsController.getAll
);

router.get('/:tid', 
    passportCall('current'),
    isUser,
    ticketsController.getById
);

export default router;