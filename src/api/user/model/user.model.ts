import mongoose from 'mongoose'
import constants from '../../../constants'
import { IUser } from '../../../interfaces'

const { Schema } = mongoose

const User = new Schema<IUser>(
    {
        email: { type: String, unique: true, required: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true },

        // email verification
        isVerified: { type: Boolean },
        emailToken: { type: String },
        avatar: { type: String, default: constants.DEFAULT_IMAGE.AVATAR },
        phoneNumber: { type: String },
        gender: { type: String },
        dateOfBirth: { type: String },
    },
    {
        // assign createAt and updateAt fields to Schema
        timestamps: true,
    },
)

export default mongoose.model('User', User)
