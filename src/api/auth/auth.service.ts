import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as crypto from 'crypto-js'
import { IUser, IGoogleUser } from '../../interfaces'
import { RegisterDTO } from './dto'

import { AUTH_ERROR_CODE, USER_ERROR_CODE } from '../../common/error-code'
import userService from '../user/user.service'
import { Config } from '../../config'
import userTokenModel from '../user/model/user-token.model'
import userModel from '../user/model/user.model'

import mailService from '../../ultis/mailService'
import Template from '../../common/templates'
import jwtDecode from 'jwt-decode'
import { use } from 'passport'

class AuthService {
    async register(registerDto: RegisterDTO) {
        // Check if user already exists
        const existedUser = await userService.getUserByEmail(registerDto.email)

        if (existedUser) throw USER_ERROR_CODE.EMAIL_ALREADY_EXIST
        const emailToken = crypto.lib.WordArray.random(32).toString()
        mailService.sendVerificationEmail(Template.verificationEmail(emailToken, registerDto.email))
        return userService.createUser({
            ...registerDto,
            password: registerDto.password
                ? await bcrypt.hash(registerDto.password, 10)
                : undefined,
            isVerified: false,
            emailToken: emailToken,
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

    async verifiedEmail(emailToken: string) {
        const user = await userModel.findOne({ emailToken })
        if (!user) throw AUTH_ERROR_CODE.INVALID_EMAIL_TOKEN
        await userModel.findOneAndUpdate({ emailToken: emailToken }, { isVerified: true })
        return { ok: true }
    }

    registerGoogleUser(token: string) {
        const googleUser = jwtDecode<IGoogleUser>(token)
        const newUser: RegisterDTO = {
            fullName: googleUser.name,
            password: '123456789',
            email: googleUser.email,
        }
        return this.register(newUser)
    }
    async extractGoogleInfo(token: string) {
        const googleUser = jwtDecode<IGoogleUser>(token)
        if (!(await userModel.exists({ email: googleUser.email }))) {
            const newUser: RegisterDTO = {
                fullName: googleUser.name,
                password: undefined,
                email: googleUser.email,
            }
            await this.register(newUser)
        }
        const user = await userModel.findOne({ email: googleUser.email })

        const User: IUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            password: '',
            isVerified: user.isVerified,
            emailToken: user.emailToken,
        }
        return User
    }
    async renewEmailToken(token: string) {
        const newToken = crypto.lib.WordArray.random(32).toString()
        const unVerifiedUser = await userModel.findOneAndUpdate(
            { emailToken: token },
            { emailToken: newToken, isVerified: false },
        )
        if (!unVerifiedUser) {
            throw USER_ERROR_CODE.EMAIL_NOT_FOUND
        }
        await mailService.send(Template.verificationEmail(newToken, unVerifiedUser.email))
        return unVerifiedUser
    }
}

export default new AuthService()
