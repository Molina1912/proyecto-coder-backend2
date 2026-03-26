// src/services/users.service.js
import UsersDAO from '../dao/users.dao.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
// 🔹 NUEVOS IMPORTS para recovery
import { generateRecoveryToken, validateRecoveryToken } from '../utils/token.js';
import { sendRecoveryEmail } from '../utils/mail.js';

const usersDAO = new UsersDAO();

export default class UsersService {
    
    // 🔹 Registrar usuario
    async register(userData) {
        const existingUser = await usersDAO.getByEmail(userData.email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
        
        const hashedPassword = await createHash(userData.password);
        
        const user = await usersDAO.create({
            ...userData,
            password: hashedPassword
        });
        
        return user;
    }
    
    // 🔹 Login de usuario
    async login(email, password) {
        const user = await usersDAO.getByEmail(email);
        
        if (!user) {
            throw new Error('Email o contraseña incorrectos');
        }
        
        const isValid = await isValidPassword(password, user.password);
        
        if (!isValid) {
            throw new Error('Email o contraseña incorrectos');
        }
        
        const token = generateToken(user);
        
        return { user, token };
    }
    
    // 🔹 Obtener usuario por ID (para /current)
    async getById(id) {
        return await usersDAO.getById(id);
    }
    
    // 🔹 Actualizar contraseña (para password recovery)
    async updatePassword(email, newPassword) {
        const user = await usersDAO.getByEmail(email);
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
        const isSamePassword = await isValidPassword(newPassword, user.password);
        if (isSamePassword) {
            throw new Error('La nueva contraseña no puede ser igual a la anterior');
        }
        
        const hashedPassword = await createHash(newPassword);
        return await usersDAO.update(user._id, { password: hashedPassword });
    }
    
    // 🔹 Solicitar recuperación de contraseña (DENTRO de la clase ✅)
    async requestPasswordRecovery(email) {
        const user = await usersDAO.getByEmail(email);
        
        if (!user) {
            // 🔐 Por seguridad, no revelar si el email existe
            return { success: true, message: 'Si el email existe, recibirás instrucciones' };
        }
        
        // Generar token de recuperación
        const { token, expiresAt } = generateRecoveryToken(email);
        
        // Guardar token en el usuario
        await usersDAO.update(user._id, {
            recoveryToken: token,
            recoveryTokenExpires: expiresAt
        });
        
        // Enviar email con el link de recuperación
        await sendRecoveryEmail(email, token);
        
        return { success: true, message: 'Si el email existe, recibirás instrucciones' };
    }
    
    // 🔹 Restablecer contraseña con token (DENTRO de la clase ✅)
    async resetPassword(email, token, newPassword) {
        const user = await usersDAO.getByEmail(email);
        
        if (!user || !user.recoveryToken || !user.recoveryTokenExpires) {
            throw new Error('Token de recuperación inválido o no solicitado');
        }
        
        // Validar token
        const validation = validateRecoveryToken(token, user.recoveryToken, user.recoveryTokenExpires);
        if (!validation.valid) {
            throw new Error(validation.message);
        }
        
        // 🔐 Verificar que no sea la misma contraseña anterior
        const isSamePassword = await isValidPassword(newPassword, user.password);
        if (isSamePassword) {
            throw new Error('La nueva contraseña no puede ser igual a la anterior');
        }
        
        // Hashear nueva contraseña y actualizar usuario
        const hashedPassword = await createHash(newPassword);
        await usersDAO.update(user._id, {
            password: hashedPassword,
            recoveryToken: null,
            recoveryTokenExpires: null
        });
        
        return { success: true, message: 'Contraseña restablecida correctamente' };
    }
}