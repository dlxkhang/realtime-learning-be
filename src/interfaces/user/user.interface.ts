import { Request } from 'express'
import { JwtPayload } from 'jwt-decode'
export interface IUser {
    _id?: string
    email: string
    fullName: string
    password?: string
    isVerified: Boolean
    emailToken: string
    avatar?: string
    phoneNumber?: string
    gender?: string
    dateOfBirth?: string
}
export interface UserInfoRequest extends Request {
    user: IUser
}

export interface IGoogleUser extends JwtPayload {
    iss: string
    nbf: number
    aud: string
    sub: string
    email: string
    email_verified: boolean
    azp: string
    name: string
    picture: string
    given_name: string
    family_name: string
    iat: number
    exp: number
    jti: string
}
