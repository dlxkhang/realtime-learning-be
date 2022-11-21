import { NextFunction, Response } from 'express'
import { AUTH_ERROR_CODE } from '../common/error-code'
import { UserInfoRequest } from '../interfaces/user/user.interface'
import userModel from '../api/user/model/user.model'
class Middleware {
    async isVerify(req: UserInfoRequest, res: Response, next: NextFunction) {
        try {
            const user = await userModel.findOne({ email: req.user.email })
            if (user.isVerified) {
                next()
            }
            return res.status(AUTH_ERROR_CODE.INVALID_EMAIL_TOKEN.statusCode).send({ message: AUTH_ERROR_CODE.INVALID_EMAIL_TOKEN.message })
        } catch (err) {
            return res.status(err.statusCode ? err.statusCode : 500).send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }
}

export default new Middleware()
