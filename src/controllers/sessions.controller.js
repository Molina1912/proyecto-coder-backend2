// src/controllers/sessions.controller.js
import UsersService from '../services/users.service.js';
import { UserDTO } from '../dto/user.dto.js';
import { generateTokenCookie } from '../middlewares/auth.middleware.js';

const usersService = new UsersService();

// 🔹 Registro de usuario
export const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        // Validaciones básicas
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                result: "error",
                message: "Todos los campos son requeridos"
            });
        }
        
        const user = await usersService.register({
            first_name,
            last_name,
            email,
            age,
            password
        });
        
        // ✅ Usar DTO también en registro para no exponer password hash
        const userDTO = UserDTO.toResponse(user);
        
        res.status(201).json({
            result: "success",
            message: "Usuario registrado correctamente",
            payload: userDTO  // ✅ DTO en lugar de user completo
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Login de usuario
export const login = async (req, res, next) => {
    try {
        const { user, token } = req.user;
        
        if (!user || !token) {
            return res.status(401).json({
                result: "error",
                message: "Credenciales inválidas"
            });
        }
        
        generateTokenCookie(res, token);
        
        res.json({
            result: "success",
            message: "Login exitoso",
            payload: { 
                email: user.email, 
                role: user.role,
                first_name: user.first_name  // ✅ Agregar nombre para bienvenida
            }
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Obtener usuario actual (DTO - sin datos sensibles)
export const current = async (req, res, next) => {
    try {
        // req.user viene de passport 'current' (JWT)
        // ✅ Convertir a DTO para filtrar datos sensibles
        const userDTO = UserDTO.toResponse(req.user);
        
        if (!userDTO) {
            return res.status(404).json({
                result: "error",
                message: "Usuario no encontrado"
            });
        }
        
        res.json({
            result: "success",
            payload: userDTO  // ✅ Solo datos no sensibles
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Logout (destruir cookie)
export const logout = async (req, res, next) => {
    try {
        res.clearCookie('coderhouse_token');
        
        res.json({
            result: "success",
            message: "Logout exitoso"
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Solicitar recuperación de contraseña
export const requestRecovery = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                result: "error",
                message: "El email es requerido"
            });
        }
        
        // 🔐 Por seguridad, siempre respondemos igual (evita enumeración de usuarios)
        const result = await usersService.requestPasswordRecovery(email);
        
        res.json({
            result: "success",
            message: result.message  // "Si el email existe, recibirás instrucciones"
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Restablecer contraseña con token
export const resetPassword = async (req, res, next) => {
    try {
        const { email, token, newPassword } = req.body;
        
        // Validaciones básicas
        if (!email || !token || !newPassword) {
            return res.status(400).json({
                result: "error",
                message: "Email, token y nueva contraseña son requeridos"
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                result: "error",
                message: "La contraseña debe tener al menos 6 caracteres"
            });
        }
        
        const result = await usersService.resetPassword(email, token, newPassword);
        
        res.json({
            result: "success",
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};