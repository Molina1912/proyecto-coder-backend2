export class UserDTO {
    constructor(user) {
        
        this.id = user.id || user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart;
        this.age = user.age;
    }
    
    static toResponse(user) {
        if (!user) return null;
        
        if (Array.isArray(user)) {
            return user.map(u => new UserDTO(u));
        }
        
        return new UserDTO(user);
    }
}