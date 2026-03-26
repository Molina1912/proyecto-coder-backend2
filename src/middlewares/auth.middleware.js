import passport from 'passport';
import config from '../config/config.js';


export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) return next(error);
            
            if (!user) {
                return res.status(401).json({
                    result: "error",
                    message: info?.messages?.[0] || "No autorizado"
                });
            }
            
            req.user = user;
            next();
        })(req, res, next);
    };
};


export const generateTokenCookie = (res, token) => {
    res.cookie('coderhouse_token', token, {
        maxAge: config.cookie.maxAge,
        httpOnly: config.cookie.httpOnly,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite
    });
};