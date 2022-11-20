import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IUser } from '../../interfaces'
import { RegisterDTO } from './dto'
import { AUTH_ERROR_CODE, USER_ERROR_CODE } from '../../common/error-code'
import userService from '../user/user.service'
import { Config } from '../../config'
import userTokenModel from '../user/model/user-token.model'

class AuthService {
    async register(registerDto: RegisterDTO) {
        // Check if user already exists
        const existedUser = await userService.getUserByEmail(registerDto.email)

        if (existedUser) throw USER_ERROR_CODE.EMAIL_ALREADY_EXIST

        const hashedPassword = await bcrypt.hash(registerDto.password, 10)
        return userService.createUser({
            ...registerDto,
            password: hashedPassword,
        })
    }

    async generateTokens(user: IUser) {
        const { _id, email, fullName } = user
        const accessToken = jwt.sign({ _id, email, fullName }, Config.JWT_SECRET, {
            expiresIn: '15m',
        })
        const refreshToken = jwt.sign({ _id, email, fullName }, Config.JWT_SECRET, {
            expiresIn: '30d',
        })

        await userTokenModel.create({ userId: _id, token: refreshToken })

        return {
            accessToken,
            refreshToken,
        }
    }

    async refreshAccessToken(refreshToken: string) {
        const userToken = await userTokenModel.findOne({ token: refreshToken })
        if (!userToken) throw AUTH_ERROR_CODE.INVALID_REFRESH_TOKEN

        try {
            const { _id, email, fullName } = jwt.verify(refreshToken, Config.JWT_SECRET) as IUser

            const newAccessToken = jwt.sign({ _id, email, fullName }, Config.JWT_SECRET, {
                expiresIn: '15m',
            })
            return {
                _id,
                email,
                fullName,
                accessToken: newAccessToken,
                refreshToken,
            }
        } catch (err) {
            throw AUTH_ERROR_CODE.INVALID_REFRESH_TOKEN
        }
    }

    async deleteToken(refreshToken: string) {
        const userToken = await userTokenModel.findOne({ token: refreshToken })
        if (!userToken) throw AUTH_ERROR_CODE.INVALID_REFRESH_TOKEN
        await userToken.remove()
        return { ok: true }
    }
}

export default new AuthService()
