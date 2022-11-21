import passport from 'passport'
import LocalStrategy from 'passport-local'
import userService from '../api/user/user.service'
import { ENV } from '../common/env'

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ENV.JWT_SECRET,
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
