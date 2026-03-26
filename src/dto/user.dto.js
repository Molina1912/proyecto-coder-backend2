// src/dto/user.dto.js

/**
 * DTO: Data Transfer Object para usuario
 * Filtra datos sensibles antes de enviar respuesta al cliente
 * 
 * ❌ EXCLUYE: password, recoveryToken, recoveryTokenExpires, __v, createdAt, updatedAt
 * ✅ INCLUYE: id, first_name, last_name, email, role, cart
 */
export class UserDTO {
    constructor(user) {
        if (!user) return;
        
        // ✅ Solo incluimos datos NO sensibles
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart;
    }
    
    /**
     * Convierte un usuario (o array) a formato DTO
     * @param {Object|Array} user - Usuario de MongoDB o array de usuarios
     * @returns {Object|Array|null} Usuario(s) en formato DTO o null si no hay usuario
     */
    static toResponse(user) {
        if (!user) return null;
        
        if (Array.isArray(user)) {
            return user.map(u => new UserDTO(u)).filter(u => u !== undefined);
        }
        
        return new UserDTO(user);
    }
    
    /**
     * Convierte a JSON limpio (sin campos undefined)
     */
    toJSON() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            role: this.role,
            cart: this.cart
        };
    }
}