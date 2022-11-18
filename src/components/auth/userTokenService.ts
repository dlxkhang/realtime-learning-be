import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { IUser, UserResponse } from '../users/userModel'
import { UserToken } from './userTokenModel'

const generateTokens = async (user: IUser) => {
    try {
        const payload = { _id: user._id, email: user.email, username: user.username }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '5m' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '10m' })

        const userToken = await UserToken.findOne({ userId: user._id })
        if (userToken) await userToken.remove()

        await new UserToken({ userId: user._id, token: refreshToken }).save()
        return await Promise.resolve({ accessToken, refreshToken })
    } catch (err) {
        return Promise.reject(err)
    }
}

const verifyRefreshToken = (
    refreshToken: string,
): Promise<{ tokenDetails: jwt.JwtPayload | string | any; error: boolean; message: string }> => {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY

    return new Promise((resolve, reject) => {
        UserToken.findOne({ token: refreshToken }, (err: mongoose.CallbackError, doc: IUser) => {
            if (!doc) return reject({ error: true, message: 'Invalid refresh token' })

            jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
                if (err) return reject({ error: true, message: 'Invalid refresh token' })
                resolve({
                    tokenDetails,
                    error: false,
                    message: 'Valid refresh token',
                })
            })
        })
    })
}

const deleteToken = async (refreshToken: string) => {
    try {
        const userToken = await UserToken.findOne({ token: refreshToken })
        if (!userToken) return await Promise.resolve({ error: false, message: 'Logged Out Sucessfully' })

        await userToken.remove()
        return await Promise.resolve({ error: false, message: 'Logged Out Sucessfully' })
    } catch (err) {
        console.log(err)
        return Promise.reject(err)
    }
}

export { generateTokens, verifyRefreshToken, deleteToken }
