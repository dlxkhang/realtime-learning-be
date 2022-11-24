import { Request, Response } from 'express'
import { IUser } from '../../interfaces'
import authService from './auth.service'

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = req.body
            const newUser = await authService.register(user)
            res.json(newUser)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }

    async login(req: Request, res: Response) {
        try {
            const session = await authService.generateTokens(req.user as IUser)

            const { _id, email, fullName } = req.user as IUser
            res.json({
                _id,
                email,
                fullName,
                session,
            })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }

    async refreshAccessToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body
            const session = await authService.refreshAccessToken(refreshToken)
            res.json({ session })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }

    async logOut(req: Request, res: Response) {
        try {
            const status = await authService.deleteToken(req.body.refreshToken)
            res.json(status)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }
}

export default new AuthController()
