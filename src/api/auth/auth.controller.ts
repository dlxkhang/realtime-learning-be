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
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
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
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }

    async refreshAccessToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body
            const session = await authService.refreshAccessToken(refreshToken)
            res.json({ session })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }

    async logOut(req: Request, res: Response) {
        try {
            const status = await authService.deleteToken(req.body.refreshToken)
            res.json(status)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
    async googeLogin(req: Request, res: Response) {
        try {
            const user = await authService.extractGoogleInfo(req.body.token)
            const session = await authService.generateTokens(user as IUser)

            const { _id, email, fullName } = user as IUser
            res.json({
                _id,
                email,
                fullName,
                session,
            })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
    async verifyEmailToken(req: Request, res: Response) {
        try {
            const token = req.params.token
            const status = await authService.verifiedEmail(token)
            res.status(200).json(status)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
    // used for account verification error
    async resendEmailToken(req: Request, res: Response) {
        try {
            const emailToken = req.body.to
            const unVerifiedUser = await authService.renewEmailToken(emailToken)
            // 204 for resource updated successfully
            res.status(204).json(unVerifiedUser)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
    //used for unrecieved verification email
    async resendVerificationEmail(req: Request, res: Response) {
        try {
            const email = req.body.email
            const unVerifiedUser = await authService.resendVerificationEmail(email)
            // 204 for resource updated successfully
            res.status(204).json(unVerifiedUser)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { email } = req.body
            const status = await authService.resetPassword(email)
            res.json(status)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
}

export default new AuthController()
