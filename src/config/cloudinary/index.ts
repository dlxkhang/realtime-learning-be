import { v2 as cloudinary } from 'cloudinary'
import { ENV } from '../../common/env'

// --------CLOUDINARY SETUP---------
cloudinary.config({
    cloud_name: ENV.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
