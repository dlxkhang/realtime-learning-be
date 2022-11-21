import { Application } from 'express'
import authRouter from '../api/auth'
import userRouter from '../api/user'
import uploadRouter from '../api/upload'

function route(app: Application) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/upload', uploadRouter)
}

export default route
