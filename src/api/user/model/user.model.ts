import mongoose from 'mongoose'
import { IUser } from '../../../interfaces'

const { Schema } = mongoose

const User = new Schema<IUser>(
    {
        email: { type: String, unique: true, required: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, default: 'https://res.cloudinary.com/dq4xoyzib/image/upload/v1668956700/lgwweg5qvz3wydozqhkl.png' },
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
