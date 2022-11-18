import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IUser, User } from './userModel'
import * as error from '../../ultis/errors'

const profile = (id: Number) => {
    return { id, name: 'Mr X', email: 'x@abc.xyz' }
}

const checkDuplicatedEmail = async (email: string) => {
    const user = await User.findOne({ email }).lean()
    return user !== null
}
const checkRepeatPassword = (newUser: IUser) => {
    return newUser.password !== newUser.repeatPassword
}

const register = async (newUser: IUser | any) => {
    const user = new User()
    if (await checkDuplicatedEmail(newUser.email)) throw new error.duplicatedEmailError(newUser.email)
    if (checkRepeatPassword(newUser)) {
        throw new error.NotMatchRepeatPasswordError('')
    }
    user.email = newUser.email
    user.username = newUser.username
    const passwordHash = await bcrypt.hash(newUser.password, 10)
    user.password = passwordHash
    return user.save()
}

const getByEmail = (email: string) => {
    return User.findOne({ email })
}

const verifyUser = async (email: string, password: string) => {
    const user = await getByEmail(email)
    if (!user) return false

    if (await bcrypt.compare(password, user.password)) return user
    return false
}
const generateToken = (id: Number, email: string, username: string) => {
    const accessToken = jwt.sign({ id, email, username }, 'serefref', { expiresIn: '15m' })
    return accessToken
}

export { profile, register, verifyUser, generateToken }
