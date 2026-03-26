import { Router } from "express";
import userModel from "../models/user.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        res.send({ result: "success", payload: users });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send({ 
            result: "error", 
            message: "Error interno del servidor" 
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, age } = req.body;

        if (!name || !email) {
            return res.status(400).send({ 
                result: "error", 
                message: "Los campos 'name' y 'email' son obligatorios" 
            });
        }

        const newUser = new userModel({ name, email, age });
        await newUser.save();

        res.status(201).send({ 
            result: "success", 
            message: "Usuario creado correctamente",
            payload: newUser 
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).send({ 
                result: "error", 
                message: "Datos inválidos", 
                details: Object.values(error.errors).map(e => e.message) 
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).send({ 
                result: "error", 
                message: "El email ya está registrado" 
            });
        }

        res.status(500).send({ 
            result: "error", 
            message: "Error interno del servidor" 
        });
    }
});

router.put('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;           
        const { name, email, age, ...rest } = req.body;  

        if (!name && !email && !age && Object.keys(rest).length === 0) {
            return res.status(400).send({ 
                result: "error", 
                message: "Debe proporcionar al menos un campo para actualizar" 
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            uid,
            { name, email, age, ...rest },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ 
                result: "error", 
                message: "Usuario no encontrado" 
            });
        }

        res.send({ 
            result: "success", 
            message: "Usuario actualizado correctamente",
            payload: updatedUser 
        });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).send({ 
                result: "error", 
                message: "Datos inválidos", 
                details: Object.values(error.errors).map(e => e.message) 
            });
        }

        if (error.code === 11000) {
            return res.status(409).send({ 
                result: "error", 
                message: "El email ya está registrado" 
            });
        }

        res.status(500).send({ 
            result: "error", 
            message: "Error interno del servidor" 
        });
    }
});


router.delete('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        
        const deletedUser = await userModel.findByIdAndDelete(uid);

        if (!deletedUser) {
            return res.status(404).send({ 
                result: "error", 
                message: "Usuario no encontrado" 
            });
        }

        res.send({ 
            result: "success", 
            message: "Usuario eliminado correctamente",
            payload: deletedUser 
        });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).send({ 
            result: "error", 
            message: "Error interno del servidor" 
        });
    }
});

export default router;