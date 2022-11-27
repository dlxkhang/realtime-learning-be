import express from 'express'
import authController from './auth.controller'
import passport from '../../auth/passport'
const router = express.Router()

router.get('/verify-email/:token', authController.verifyEmailToken)
router.post('/resend-verification-mail/', authController.resendEmailToken)
router.post('/resend-mail/', authController.resendVerificationEmail)
router.post('/register', authController.register)
router.post('/login-by-google', authController.googeLogin)
router.post('/login', passport.authenticate('local', { session: false }), authController.login)
router.post('/refresh', authController.refreshAccessToken)
router.post('/log-out', passport.authenticate('jwt', { session: false }), authController.logOut)
export default router
