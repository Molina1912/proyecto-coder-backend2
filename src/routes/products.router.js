// src/routes/products.router.js
import { Router } from 'express';
import * as productsController from '../controllers/products.controller.js';
import { passportCall } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/roles.middleware.js';

const router = Router();

// GET /api/products - Listar productos (PÚBLICO)
router.get('/', productsController.getAll);

// GET /api/products/:pid - Obtener producto por ID (PÚBLICO)
router.get('/:pid', productsController.getById);

// POST /api/products - Crear producto (SOLO ADMIN)
router.post('/', 
    passportCall('current'),
    isAdmin,
    productsController.create
);

// PUT /api/products/:pid - Actualizar producto (SOLO ADMIN)
router.put('/:pid', 
    passportCall('current'),
    isAdmin,
    productsController.update
);

// DELETE /api/products/:pid - Eliminar producto (SOLO ADMIN)
// ✅ CORREGIDO: productsController.deleteProduct (coincide con el controller)
router.delete('/:pid', 
    passportCall('current'),
    isAdmin,
    productsController.deleteProduct  // ← Nombre correcto ✅
);

export default router;