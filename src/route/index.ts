import { Application } from 'express'
import authRouter from '../api/auth'
import userRouter from '../api/user'

function route(app: Application) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
}

export default route
