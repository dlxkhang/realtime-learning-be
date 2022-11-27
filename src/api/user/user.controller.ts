import { Request, Response } from 'express'
import { IUser } from '../../interfaces'
import { mapTo } from './mapper'
import userService from './user.service'

class UserController {
    async getProfile(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const user = await userService.getProfileById(_id)
            res.json(mapTo(user))
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const user = await userService.updateProfile(_id, req.body)
            res.json(mapTo(user))
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }

    async updatePassword(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const user = await userService.updatePassword(_id, req.body)
            res.json(mapTo(user))
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
}

export default new UserController()
