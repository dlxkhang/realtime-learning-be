import { NextFunction, Response } from 'express'
import { AUTH_ERROR_CODE, USER_ERROR_CODE } from '../common/error-code'
import { UserInfoRequest } from '../interfaces/user/user.interface'
import userModel from '../api/user/model/user.model'
class Middleware {
    async isVerify(req: UserInfoRequest, res: Response, next: NextFunction) {
        try {
            const user = await userModel.findOne({ email: req.body.email })
            if (!user) {
                return res
                    .status(USER_ERROR_CODE.EMAIL_NOT_FOUND.statusCode)
                    .send(USER_ERROR_CODE.EMAIL_NOT_FOUND.message)
            }
            if (!user.isVerified) {
                return res
                    .status(AUTH_ERROR_CODE.INVALID_EMAIL_TOKEN.statusCode)
                    .send(AUTH_ERROR_CODE.INVALID_EMAIL_TOKEN.message)
            }
            next()
        } catch (err) {
            return res
                .status(err.statusCode ? err.statusCode : 500)
                .send(err.statusCode ? err.message : 'Internal Server Error')
        }
    }
}

export default new Middleware()
