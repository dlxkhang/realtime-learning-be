import { Types } from 'mongoose'

export interface IUserToken {
    _id?: string
    userId: Types.ObjectId
    token: string
}
