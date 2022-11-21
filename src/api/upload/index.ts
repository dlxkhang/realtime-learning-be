import express from 'express'
import uploadController from './upload.controller'
import passport from '../../auth/passport'
import multerInstance from '../../config/multer'

const router = express.Router()
router.post('/upload-file', passport.authenticate('jwt', { session: false }), multerInstance.single('file'), uploadController.uploadFile)

export default router
