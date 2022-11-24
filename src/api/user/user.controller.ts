import { Request, Response } from 'express'
import { IUser } from '../../interfaces'
import userService from './user.service'

class UserController {
    async getProfile(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const user = await userService.getProfileById(_id)
            const { password, ...profile } = user
            res.json(profile)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const user = await userService.updateProfile(_id, req.body)
            res.json({
                _id: user._id,
                avatar: user.avatar,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
            })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }
}

export default new UserController()
