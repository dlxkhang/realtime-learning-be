import streamifier from 'streamifier'
import cloudinary from '../../config/cloudinary'

class UploadService {
    uploadFile(img: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const cld_upload_stream = cloudinary.uploader.upload_stream((err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(result.secure_url)
            })
            // Push img.buffer in to upload stream
            streamifier.createReadStream(img.buffer).pipe(cld_upload_stream)
        })
    }
}

export default new UploadService()
