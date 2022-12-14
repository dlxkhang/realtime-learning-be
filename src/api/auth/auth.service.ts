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

import mailService from '../../utils/mail.util'
import Template from '../../common/templates'
import jwtDecode from 'jwt-decode'
import { use } from 'passport'
import { randomPassword } from '../../utils/auth.util'

class AuthService {
    async register(registerDto: RegisterDTO) {
        // Check if user already exists
        const existedUser = await userService.getUserByEmail(registerDto.email)

        if (existedUser) throw USER_ERROR_CODE.EMAIL_ALREADY_EXIST
        const emailToken = crypto.lib.WordArray.random(32).toString()

        await mailService.send(Template.verificationEmail(emailToken, registerDto.email))
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
        if (user.isVerified) throw AUTH_ERROR_CODE.EMAIL_ALREADY_VERIFIED
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

    async resendVerificationEmail(email: string) {
        const newToken = crypto.lib.WordArray.random(32).toString()
        const unVerifiedUser = await userModel.findOneAndUpdate(
            { email: email },
            { emailToken: newToken, isVerified: false },
        )
        if (!unVerifiedUser) {
            throw USER_ERROR_CODE.EMAIL_NOT_FOUND
        }
        await mailService.send(Template.verificationEmail(newToken, unVerifiedUser.email))
        return unVerifiedUser
    }

    async resetPassword(email: string): Promise<{ ok: boolean }> {
        // Check if user already exists
        const user = await userService.getUserByEmail(email)

        if (!user) throw USER_ERROR_CODE.EMAIL_NOT_FOUND
        const newPassword = randomPassword()

        const session = await userModel.startSession()
        session.startTransaction()
        try {
            const hashPassword = await bcrypt.hash(newPassword, 10)

            await mailService.send(Template.resetPassword(email, newPassword))

            await user.updateOne(
                {
                    $set: {
                        password: hashPassword,
                    },
                },
                { session },
            )

            await session.commitTransaction()
            session.endSession()
        } catch (error) {
            // console.log('error: ', error.);
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            await session.abortTransaction()
            session.endSession()

            throw error
        }
        return { ok: true }
    }
}

export default new AuthService()
