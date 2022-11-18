import { Schema, model, connect } from 'mongoose'
// import { Schema, model, connect } from 'mongoose';

interface IUser {
    _id?: string
    email: string
    username: string
    password: string
    repeatPassword: string
}
interface UserResponse {
    _id?: string
    email: string
    username: string
    password?: string
}
const userSchema = new Schema<IUser>({
    email: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true, maxLength: 100 },
})

const User = model<IUser>('user', userSchema, 'users')

export { User, IUser, UserResponse }
