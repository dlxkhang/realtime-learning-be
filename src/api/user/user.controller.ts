import { Request, Response } from 'express'
import { IUser } from '../../interfaces'
import userService from './user.service'

class UserController {
    async getProfile(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const userProfile = await userService.getProfileById(_id)
            res.json(userProfile)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }
}

export default new UserController()
