// src/routes/sessions.router.js
import { Router } from 'express';
import * as sessionsController from '../controllers/sessions.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isUserOrAdmin } from '../middlewares/roles.middleware.js';

const router = Router();

// 🔹 POST /api/sessions/register - Registro (PÚBLICO)
router.post('/register', 
    passportCall('register'),
    sessionsController.register
);

// 🔹 POST /api/sessions/login - Login (PÚBLICO)
router.post('/login', 
    passportCall('login'),
    sessionsController.login
);

// 🔹 GET /api/sessions/current - Usuario actual (PROTEGIDA: user o admin)
router.get('/current', 
    passportCall('current'),
    isUserOrAdmin,
    sessionsController.current
);

// 🔹 POST /api/sessions/logout - Logout (PÚBLICO)
router.post('/logout', 
    sessionsController.logout
);

// 🔹 POST /api/sessions/recover-password - Solicitar recuperación (PÚBLICO)
router.post('/recover-password', 
    sessionsController.requestRecovery
);

// 🔹 POST /api/sessions/reset-password - Restablecer contraseña (PÚBLICO)
router.post('/reset-password', 
    sessionsController.resetPassword
);

export default router;