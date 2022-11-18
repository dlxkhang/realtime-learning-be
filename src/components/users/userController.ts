import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as usersService from './userService'
import * as userTokenService from '../auth/userTokenService'
import * as error from '../../ultis/errors'
import { IUser, UserResponse } from './userModel'

const profile = (req: Request, res: Response) => {
    // res.json(usersService.profile(1));
    res.status(200).json(req.user)
}

const register = async (req: Request, res: Response) => {
    try {
        const newUser = req.body
        const rs = await usersService.register(newUser)

        if (rs !== undefined) res.status(201).json({ user: rs.username, email: rs.email })
        // else
        //   res.status(400).json({errorMessage: rs.message ?? 'Unknown error'});
    } catch (e) {
        if (e instanceof error.duplicatedEmailError) {
            res.status(e.statusCode).json({
                code: e.statusCode,
                data: e.message ?? 'Unknown error',
            })
        } else if (e instanceof error.NotMatchRepeatPasswordError) {
            res.status(e.statusCode).json({
                code: e.statusCode,
                data: e.message ?? 'Unknown error',
            })
        } else {
            const systemError = new error.SystemError()
            res.status(systemError.statusCode).json({
                code: e.statusCode,
                data: e.message ?? 'Unknown error',
            })
        }
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { _id, email, username } = req.user as IUser
        const { accessToken, refreshToken } = await userTokenService.generateTokens({ _id, email, username } as IUser)
        return res.status(200).json({ _id, email, username, accessToken, refreshToken })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: true, message: 'Internal Server Error' })
    }
}

const refreshToken = async (req: Request, res: Response) => {
    userTokenService
        .verifyRefreshToken(req.body.refreshToken)
        .then(({ tokenDetails, error, message }) => {
            const payload = { _id: tokenDetails._id, email: tokenDetails.email, username: tokenDetails.username }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '1m' })
            res.status(200).json({
                error: false,
                accessToken,
                message: 'Access token created successfully',
            })
        })
        .catch((err) => res.status(400).json(err))
}
const deleteToken = async (req: Request, res: Response) => {
    try {
        const rs = await userTokenService.deleteToken(req.body.refreshToken)
        if (rs.error == false) return res.status(200).json({ error: false, message: 'Logged Out Sucessfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: true, message: 'Internal Server Error' })
    }
}

export { profile, register, login, refreshToken, deleteToken }
