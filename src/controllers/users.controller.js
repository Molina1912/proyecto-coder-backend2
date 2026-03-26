// src/controllers/users.controller.js
import UsersService from '../services/users.service.js';
import { UserDTO } from '../dto/user.dto.js';

const usersService = new UsersService();

// 🔹 Listar todos los usuarios (SOLO ADMIN)
export const getAll = async (req, res, next) => {
    try {
        const users = await usersService.getAll();
        
        // ✅ Usar DTO para no exponer datos sensibles en lista
        const usersDTO = UserDTO.toResponse(users);
        
        res.json({
            result: "success",
            payload: usersDTO
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Obtener usuario por ID (SOLO ADMIN)
export const getById = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getById(uid);
        
        if (!user) {
            return res.status(404).json({
                result: "error",
                message: "Usuario no encontrado"
            });
        }
        
        // ✅ Usar DTO para respuesta
        const userDTO = UserDTO.toResponse(user);
        
        res.json({
            result: "success",
            payload: userDTO
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Crear usuario (SOLO ADMIN)
export const create = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        
        // Validaciones básicas
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                result: "error",
                message: "Los campos first_name, last_name, email y password son requeridos"
            });
        }
        
        const user = await usersService.register({
            first_name,
            last_name,
            email,
            age,
            password,
            role: role || 'user'  // Por defecto 'user'
        });
        
        // ✅ Usar DTO para no exponer password hash
        const userDTO = UserDTO.toResponse(user);
        
        res.status(201).json({
            result: "success",
            message: "Usuario creado correctamente",
            payload: userDTO
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Actualizar usuario por ID (SOLO ADMIN)
export const update = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const updateData = req.body;
        
        // ✅ No permitir actualizar password desde este endpoint
        // (usar sistema de recuperación para eso)
        if (updateData.password) {
            delete updateData.password;
        }
        
        const updatedUser = await usersService.update(uid, updateData);
        
        if (!updatedUser) {
            return res.status(404).json({
                result: "error",
                message: "Usuario no encontrado"
            });
        }
        
        // ✅ Usar DTO para respuesta
        const userDTO = UserDTO.toResponse(updatedUser);
        
        res.json({
            result: "success",
            message: "Usuario actualizado correctamente",
            payload: userDTO
        });
    } catch (error) {
        next(error);
    }
};

// 🔹 Eliminar usuario por ID (SOLO ADMIN)
export const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        
        const deletedUser = await usersService.delete(uid);
        
        if (!deletedUser) {
            return res.status(404).json({
                result: "error",
                message: "Usuario no encontrado"
            });
        }
        
        // ✅ Usar DTO para respuesta (sin datos sensibles)
        const userDTO = UserDTO.toResponse(deletedUser);
        
        res.json({
            result: "success",
            message: "Usuario eliminado correctamente",
            payload: userDTO
        });
    } catch (error) {
        next(error);
    }
};