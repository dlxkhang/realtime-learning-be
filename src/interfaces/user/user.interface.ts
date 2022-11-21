import { Request } from 'express'
export interface IUser {
    _id?: string
    email: string
    fullName: string
    password: string
    isVerified: Boolean
    emailToken: string
}

export interface UserInfoRequest extends Request {
    user: IUser
}
