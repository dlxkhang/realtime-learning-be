import express from 'express'
import invitationController from './invitation.controller'
import passport from '../../auth/passport'

const router = express.Router()
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    invitationController.getInvitation,
)
router.post(
    '/create-shared-invitation',
    passport.authenticate('jwt', { session: false }),
    invitationController.createSharedInvitation,
)
router.post(
    '/create-email-invitations',
    passport.authenticate('jwt', { session: false }),
    invitationController.createEmailInvitations,
)
router.post(
    '/accept-invitation',
    passport.authenticate('jwt', { session: false }),
    invitationController.acceptInvitation,
)

export default router
