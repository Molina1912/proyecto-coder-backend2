// src/routes/carts.router.js
import { Router } from 'express';
import * as cartsController from '../controllers/carts.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isUser } from '../middlewares/roles.middleware.js';

const router = Router();

// GET /api/carts - Listar carritos (SOLO USUARIO)
router.get('/', 
    passportCall('current'),
    isUser,
    cartsController.getAll
);

// GET /api/carts/:cid - Obtener carrito por ID (SOLO USUARIO)
router.get('/:cid', 
    passportCall('current'),
    isUser,
    cartsController.getById
);

// POST /api/carts - Crear carrito (SOLO USUARIO)
router.post('/', 
    passportCall('current'),
    isUser,
    cartsController.create
);

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito (SOLO USUARIO)
router.post('/:cid/product/:pid', 
    passportCall('current'),
    isUser,
    cartsController.addProduct
);

// DELETE /api/carts/:cid/product/:pid - Eliminar producto del carrito (SOLO USUARIO)
router.delete('/:cid/product/:pid', 
    passportCall('current'),
    isUser,
    cartsController.removeProduct
);

// PUT /api/carts/:cid - Actualizar carrito (SOLO USUARIO)
router.put('/:cid', 
    passportCall('current'),
    isUser,
    cartsController.update
);

// DELETE /api/carts/:cid - Vaciar carrito (SOLO USUARIO)
router.delete('/:cid', 
    passportCall('current'),
    isUser,
    cartsController.clear
);

// 🔹 POST /api/carts/:cid/purchase - FINALIZAR COMPRA (SOLO USUARIO)
router.post('/:cid/purchase', 
    passportCall('current'),
    isUser,
    cartsController.purchase
);

export default router;