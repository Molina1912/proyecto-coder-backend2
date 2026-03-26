import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import config from './config.js';
import UsersService from '../services/users.service.js';

const usersService = new UsersService();


const cookieExtractor = (req) => {
    let token = null;
    if (req?.cookies) {
        token = req.cookies['coderhouse_token'];
    }
    return token;
};


passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
}, async (req, email, password, done) => {
    try {
        const { first_name, last_name, age } = req.body;
        
        const user = await usersService.register({
            first_name,
            last_name,
            email,
            age,
            password
        });
        
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));


passport.use('login', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const result = await usersService.login(email, password);
        return done(null, result);
    } catch (error) {
        return done(error, false);
    }
}));


passport.use('current', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.jwtSecret
}, async (jwt_payload, done) => {
    try {
        
        return done(null, jwt_payload);
    } catch (error) {
        return done(error, false);
    }
}));


export const initializePassport = () => {
    passport.initialize();
};

export default passport;