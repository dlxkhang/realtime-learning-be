import passport from 'passport'
import LocalStrategy from 'passport-local'
import userService from '../api/user/user.service'
import { Config } from '../config'

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Config.JWT_SECRET,
}

passport.use(
    new LocalStrategy.Strategy({ usernameField: 'email' }, async function verify(username, password, cb) {
        try {
            const user = await userService.verifyUser(username, password)
            if (user) return cb(null, user)
            return cb(null, false, { message: 'Incorrect username or password' })
        } catch (err) {
            return cb(err)
        }
    }),
)

passport.use(
    'google-login-jwt',
    new JwtStrategy(opts, async function ({ email }: { email: string }, done: any) {
        try {
            const user = await userService.verifyGoogleToken(email)
            if (user) return done(null, user)
            return done(null, false, { message: 'Invalid token' })
        } catch (err) {
            return done(err, false)
        }
    }),
)

passport.use(
    'jwt',
    new JwtStrategy(opts, async function ({ _id }: { _id: string }, done: any) {
        try {
            const user = await userService.verifyTokenPayload(_id)
            if (user) return done(null, user)
            return done(null, false, { message: 'Invalid token' })
        } catch (err) {
            return done(err, false)
        }
    }),
)

export default passport
