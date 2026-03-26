
# Backend Coderhouse - Entrega Final

E-commerce backend con arquitectura por capas, autenticación JWT, sistema de roles y lógica de compra.

## Tecnologías

- Node.js + Express
- MongoDB Atlas + Mongoose
- Passport.js (JWT + Local strategies)
- Nodemailer (recuperación de contraseña)
- bcrypt (hash de contraseñas)
- dotenv (variables de entorno)

## Estructura del Proyecto

Backend_2_coderhouse
├─ package-lock.json
├─ package.json
└─ src
   ├─ app.js
   ├─ config
   │  ├─ config.js
   │  └─ passport.config.js
   ├─ controller
   │  ├─ carts.controller.cl
   │  ├─ products.controller.js
   │  ├─ sessions.controller.js
   │  └─ users.controller.js
   ├─ dao
   │  ├─ carts.dao.js
   │  ├─ product.dao.js
   │  ├─ tickets.dao.js
   │  └─ user.dao.js
   ├─ dto
   │  └─ user.dto.js
   ├─ middlewares
   │  ├─ auth.middleware.js
   │  └─ roles.middleware.js
   ├─ models
   │  ├─ cart.model.js
   │  ├─ product.model.js
   │  ├─ ticket.model.js
   │  └─ user.model.js
   ├─ public
   │  ├─ index.html
   │  ├─ login.html
   │  └─ profile.html
   ├─ routes
   │  ├─ carts.router.js
   │  ├─ product.router.js
   │  ├─ sessions.router.js
   │  ├─ tickets.router.js
   │  └─ users.router.js
   ├─ services
   │  ├─ cart.sservice.js
   │  ├─ product.service.js
   │  ├─ stickers.service.js
   │  └─ users.service.js
   └─ utils
      ├─ bcrypt.js
      ├─ jwt.js
      └─ mail.js



---

## 📥 Instalación y Configuración

### Prerrequisitos
- Node.js v18 o superior
- MongoDB Atlas (cuenta gratuita)
- Git instalado

## Clonar el repositorio
bash

git clone https://github.com/Molina1912/proyecto-coder-backend2.git

# Navegar al directorio
cd proyecto-coder-backend2

# 1. Registro de usuario
POST http://localhost:8080/api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@email.com",
  "age": 30,
  "password": "123456"
}

# 2. Login (recibe cookie JWT)
POST http://localhost:8080/api/sessions/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "password": "123456"
}

# 3. Obtener usuario actual (protegido)
GET http://localhost:8080/api/sessions/current
# Postman envía la cookie automáticamente