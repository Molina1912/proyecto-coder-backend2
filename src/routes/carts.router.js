
import { Router } from 'express';
import * as cartsController from '../controllers/carts.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isUser } from '../middlewares/roles.middleware.js';

const router = Router();


router.get('/', 
    passportCall('current'),
    isUser,
    cartsController.getAll
);


router.get('/:cid', 
    passportCall('current'),
    isUser,
    cartsController.getById
);


router.post('/', 
    passportCall('current'),
    isUser,
    cartsController.create
);


router.post('/:cid/product/:pid', 
    passportCall('current'),
    isUser,
    cartsController.addProduct
);


router.delete('/:cid/product/:pid', 
    passportCall('current'),
    isUser,
    cartsController.removeProduct
);


router.put('/:cid', 
    passportCall('current'),
    isUser,
    cartsController.update
);


router.delete('/:cid', 
    passportCall('current'),
    isUser,
    cartsController.clear
);


router.post('/:cid/purchase', 
    passportCall('current'),
    isUser,
    cartsController.purchase
);

export default router;