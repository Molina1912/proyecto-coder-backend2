
# 🎓 Backend Coderhouse - Entrega Final

E-commerce backend con arquitectura por capas, autenticación JWT, sistema de roles y lógica de compra.

## 🛠️ Tecnologías

- Node.js + Express
- MongoDB Atlas + Mongoose
- Passport.js (JWT + Local strategies)
- Nodemailer (recuperación de contraseña)
- bcrypt (hash de contraseñas)
- dotenv (variables de entorno)

## 📁 Estructura del Proyecto

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


