import { Request, Response } from 'express'
import uploadService from './upload.service'

class UploadController {
    async uploadFile(req: Request, res: Response) {
        try {
            const fileUrl = await uploadService.uploadFile(req.file)
            res.json({
                fileUrl,
            })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }
}

export default new UploadController()
