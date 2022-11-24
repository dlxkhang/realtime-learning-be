import express from 'express'
import passport from '../../auth/passport'
import groupController from './group.controller'

const router = express.Router()
router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    groupController.createGroup,
)
router.put(
    '/edit/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.editGroup,
)
router.get(
    '/get/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.getGroup,
)
router.get('/getOwn', passport.authenticate('jwt', { session: false }), groupController.getGroupOwn)
router.get(
    '/getGroupJoined',
    passport.authenticate('jwt', { session: false }),
    groupController.getGroupJoined,
)
router.post(
    '/addMember/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.addMember,
)
router.post(
    '/removeMember/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.removeMember,
)
router.post(
    '/addCoOwner/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.addCoOwner,
)
router.post(
    '/removeCoOwner/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.removeCoOwner,
)
router.delete(
    '/delete/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.deleteGroup,
)
export default router
