import UsersService from '../services/users.service.js';
import { UserDTO } from '../dto/user.dto.js';

const usersService = new UsersService();


export const getAll = async (req, res, next) => {
    try {
        const users = await usersService.getAll();
        
        
        const usersDTO = UserDTO.toResponse(users);
        
        res.json({
            result: "success",
            payload: usersDTO
        });
    } catch (error) {
        next(error);
    }
};


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
        
        
        const userDTO = UserDTO.toResponse(user);
        
        res.json({
            result: "success",
            payload: userDTO
        });
    } catch (error) {
        next(error);
    }
};


export const create = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        
        
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
            role: role || 'user'  
        });
        
        
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


export const update = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const updateData = req.body;

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