// src/middlewares/roles.middleware.js

// 🔹 Middleware de autorización por roles
export const authorization = (allowedRoles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                result: "error",
                message: "No autorizado: Inicia sesión primero"
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                result: "error",
                message: "Prohibido: No tienes permisos suficientes"
            });
        }
        
        next();
    };
};

// 🔹 Middlewares predefinidos para uso fácil
export const isAdmin = authorization(['admin']);
export const isUser = authorization(['user']);
export const isUserOrAdmin = authorization(['user', 'admin']);