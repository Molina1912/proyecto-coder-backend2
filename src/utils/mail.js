// src/utils/mail.js
import nodemailer from 'nodemailer';
import config from '../config/config.js';

/**
 * Crear transportador de email (configurado una sola vez)
 * @returns {Transporter} Transporter de Nodemailer
 */
export const createTransporter = () => {
    // 🔹 Validar configuración de email
    if (!config.email.user || !config.email.pass) {
        console.warn('⚠️ EMAIL_USER o EMAIL_PASS no configurados');
    }
    
    return nodemailer.createTransport({
        service: config.email.service || 'gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });
};

/**
 * Enviar email de recuperación de contraseña
 * @param {string} userEmail - Email del usuario
 * @param {string} recoveryToken - Token de recuperación
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendRecoveryEmail = async (userEmail, recoveryToken) => {
    try {
        // 🔹 En desarrollo, solo loguear (sin enviar email real)
        if (config.isDevelopment && !config.email.user) {
            console.log('📧 [DEV MODE] Email de recuperación para:', userEmail);
            console.log('🔗 Link:', `http://localhost:8080/api/sessions/reset-password?token=${recoveryToken}&email=${userEmail}`);
            return { success: true, messageId: 'dev-mode' };
        }
        
        const transporter = createTransporter();
        
        // 🔗 Link de recuperación (expira en 1 hora)
        const recoveryLink = `http://localhost:8080/api/sessions/reset-password?token=${recoveryToken}&email=${userEmail}`;
        
        // 📧 Contenido del email
        const mailOptions = {
            from: `"Backend Coderhouse" <${config.email.user}>`,
            to: userEmail,
            subject: '🔐 Recuperación de Contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #667eea; margin-bottom: 20px;">Recuperación de Contraseña</h2>
                    <p style="margin-bottom: 15px;">Hola,</p>
                    <p style="margin-bottom: 20px;">Has solicitado restablecer tu contraseña. Haz clic en el botón abajo para continuar:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${recoveryLink}" 
                           style="background: #667eea; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;
                                  font-weight: bold;">
                            Restablecer Contraseña
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        ⚠️ Este enlace expirará en <strong>1 hora</strong>.<br>
                        Si no solicitaste este cambio, puedes ignorar este email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        Backend Coderhouse - Entrega Final 🎓
                    </p>
                </div>
            `
        };
        
        // 📤 Enviar email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de recuperación enviado:', info.messageId);
        
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Error enviando email:', error.message);
        // 🔹 No exponer el error real al usuario por seguridad
        throw new Error('No se pudo enviar el email de recuperación');
    }
};