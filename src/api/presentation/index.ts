import express from 'express'
import passport from '../../auth/passport'
import presentationController from './presentation.controller'
const router = express.Router()
router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    presentationController.createPresentation,
)
router.get(
    '/get/:id',
    passport.authenticate('jwt', { session: false }),
    presentationController.getPresentationById,
)
router.put(
    '/edit/:id',
    passport.authenticate('jwt', { session: false }),
    presentationController.editPresentationById,
)
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    presentationController.deletePresentationById,
)
router.post(
    '/slide/add',
    passport.authenticate('jwt', { session: false }),
    presentationController.addSlide,
)
router.delete(
    '/slide/delete/:presentationId&:slideId',
    passport.authenticate('jwt', { session: false }),
    presentationController.deleteSlideById,
)
router.get(
    '/:presentationId/slide/getAll',
    passport.authenticate('jwt', { session: false }),
    presentationController.getSlideList,
)
router.put(
    '/slide/edit/:slideId',
    passport.authenticate('jwt', { session: false }),
    presentationController.editSlideById,
)
router.post('/slide/update-answer', presentationController.updateAnswer)
router.get('/slide/get/:presentationCode', presentationController.getPresentingSlide)
// get list of presentation by user id
router.get(
    '/get-all',
    passport.authenticate('jwt', { session: false }),
    presentationController.getPresentationListByUserId,
)

router.post('/slide/update-present-status', presentationController.updatePresentStatus)
export default router
