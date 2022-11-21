import multer from 'multer'

// ----------SETUP MULTER------------
const maxfileSize = 20000000 // 20MB
const storage = multer.memoryStorage()
const multerInstance = multer({
    storage: storage,
    limits: { fileSize: maxfileSize },
})

export default multerInstance
