import mongoose from 'mongoose'
import { IUser } from '../../../interfaces'

const { Schema } = mongoose

const User = new Schema<IUser>(
    {
        email: { type: String, unique: true, required: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        // assign createAt and updateAt fields to Schema
        timestamps: true,
    },
)

export default mongoose.model('User', User)
