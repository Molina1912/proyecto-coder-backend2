import { Router } from 'express';
import * as productsController from '../controllers/products.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/roles.middleware.js';

const router = Router();


router.get('/', productsController.getAll);


router.get('/:pid', productsController.getById);


router.post('/', 
    passportCall('current'),
    isAdmin,
    productsController.create
);


router.put('/:pid', 
    passportCall('current'),
    isAdmin,
    productsController.update
);

router.delete('/:pid', 
    passportCall('current'),
    isAdmin,
    productsController.deleteProduct  
);

export default router;