import mongoose from 'mongoose'
import { IUserToken } from '../../../interfaces'
const Schema = mongoose.Schema

const UserToken = new Schema<IUserToken>(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        token: { type: String, required: true },
    },
    {
        // assign createAt and updateAt fields to Schema
        timestamps: true,
    },
)

export default mongoose.model('UserToken', UserToken)
