import express from 'express'
import presentationController from './presentation.controller'
const router = express.Router()
router.post('/create', presentationController.createPresentation)
router.get('/get/:id', presentationController.getPresentationById)
router.put('/edit/:id', presentationController.editPresentationById)
router.delete('/delete/:id', presentationController.deletePresentationById)
router.post('/slide/add', presentationController.addSlide)
router.delete('/slide/delete/:slideId', presentationController.deleteSlide)
export default router
