
import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const createTransporter = () => {
    console.log('Configuración de email:', {
        service: config.email.service,
        user: config.email.user
    });
    
    return nodemailer.createTransport({
        service: config.email.service || 'gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });
};

export const sendRecoveryEmail = async (userEmail, recoveryToken) => {
    try {
        console.log('Intentando enviar email a:', userEmail);
        
        const transporter = createTransporter();
        
        const recoveryLink = `http://localhost:8080/api/sessions/reset-password?token=${recoveryToken}&email=${userEmail}`;
        
        const mailOptions = {
            from: `"Backend Coderhouse" <${config.email.user}>`,
            to: userEmail,
            subject: 'Recuperación de Contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Recuperación de Contraseña</h2>
                    <p>Haz clic en el enlace para restablecer:</p>
                    <a href="${recoveryLink}">${recoveryLink}</a>
                </div>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente:', info.messageId);
        
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error enviando email:', error.message);
        console.error('Detalles:', error);
        throw new Error('No se pudo enviar el email de recuperación');
    }
};