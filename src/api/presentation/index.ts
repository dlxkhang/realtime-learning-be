import express from 'express'
import presentationController from './presentation.controller'
const router = express.Router()
router.post('/create', presentationController.createPresentation)

export default router
