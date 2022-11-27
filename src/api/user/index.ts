import express from 'express'
import userController from './user.controller'
import passport from '../../auth/passport'

const router = express.Router()
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getProfile)
router.post(
    '/update-profile',
    passport.authenticate('jwt', { session: false }),
    userController.updateProfile,
)
router.post(
    '/update-password',
    passport.authenticate('jwt', { session: false }),
    userController.updatePassword,
)

export default router
