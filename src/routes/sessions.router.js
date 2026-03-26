import { Router } from 'express';
import * as sessionsController from '../controllers/sessions.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isUserOrAdmin } from '../middlewares/roles.middleware.js';

const router = Router();

router.post('/register', 
    passportCall('register'),
    sessionsController.register
);

router.post('/login', 
    passportCall('login'),
    sessionsController.login
);

router.get('/current', 
    passportCall('current'),
    isUserOrAdmin,
    sessionsController.current
);

router.post('/logout', 
    sessionsController.logout
);

router.post('/recover-password', 
    sessionsController.requestRecovery
);

router.post('/reset-password', 
    sessionsController.resetPassword
);

export default router;