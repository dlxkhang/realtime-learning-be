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
    '/groupJoined',
    passport.authenticate('jwt', { session: false }),
    groupController.getGroupJoined,
)
router.post(
    '/groupHasPrivilege',
    passport.authenticate('jwt', { session: false }),
    groupController.getGroupHasPrivilege,
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
    '/grantRole/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.grantRole,
)
router.post(
    '/revokeRole/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.revokeRole,
)
router.delete(
    '/delete/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.deleteGroup,
)

router.get(
    '/role/:groupId',
    passport.authenticate('jwt', { session: false }),
    groupController.getRole,
)
export default router
