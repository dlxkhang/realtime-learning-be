import { Application } from 'express'
import authRouter from '../api/auth'
import userRouter from '../api/user'
import groupRouter from '../api/group'

function route(app: Application) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/group', groupRouter)
}

export default route
