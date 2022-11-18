import express from 'express'
import * as usersController from './userController'
import passport from '../auth/passport'

const router = express.Router()

router.get('/profile', passport.authenticate('jwt', { session: false }), usersController.profile)

router.post('/register', usersController.register)
router.post('/login', passport.authenticate('local', { session: false }), usersController.login)
router.post('/refreshToken', usersController.refreshToken)
router.post('/logout', usersController.deleteToken)

export default router
