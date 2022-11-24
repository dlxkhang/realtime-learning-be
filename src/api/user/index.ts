import express from 'express'
import userController from './user.controller'
import passport from '../../auth/passport'

const router = express.Router()
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getProfile)

export default router
