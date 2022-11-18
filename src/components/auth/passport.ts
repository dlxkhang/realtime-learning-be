import passport from 'passport'
import LocalStrategy from 'passport-local'
import JwtStrategy from 'passport-jwt'
import ExtractJwt from 'passport-jwt'
import * as usersService from '../users/userService'

export {}

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'uITRXbSab2ZMX9HEU9dFltlx5RqrjrsR';

passport.use(
    new JwtStrategy.Strategy(
        {
            jwtFromRequest: ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'uITRXbSab2ZMX9HEU9dFltlx5RqrjrsR',
        },
        (jwt_payload, done) => {
            try {
                const user = jwt_payload
                return done(null, user)
            } catch (err) {
                return done(err, false)
            }
        },
    ),
)

passport.use(
    new LocalStrategy.Strategy({ usernameField: 'email', passwordField: 'password' }, async (username, password, cb) => {
        try {
            const user = await usersService.verifyUser(username, password)
            if (user) return cb(null, user)
            return cb(null, false, { message: 'Incorrect username or password.' })
        } catch (e) {
            return cb(e)
        }
    }),
)
// dung passport -jwt
export default passport
