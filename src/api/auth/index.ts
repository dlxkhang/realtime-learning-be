import express from 'express'
import authController from './auth.controller'
import passport from '../../auth/passport'
import Middleware from '../../middleware/middleware'
const router = express.Router()
router.get('/verify-email/:token', authController.verifyEmailToken)
router.post('/register', authController.register)
router.post('/login-by-google', authController.googeLogin)
router.post('/login', Middleware.isVerify, passport.authenticate('local', { session: false }), authController.login)
router.post('/refresh', authController.refreshAccessToken)
router.post('/log-out', passport.authenticate('jwt', { session: false }), authController.logOut)
export default router
