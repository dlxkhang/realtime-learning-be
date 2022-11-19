import express from 'express'
import authController from './auth.controller'
import passport from '../../auth/passport'

const router = express.Router()
router.post('/register', authController.register)
router.post('/login', passport.authenticate('local', { session: false }), authController.login)
router.post('/refresh', authController.refreshAccessToken)
router.post('/logout', authController.logOut)

export default router
