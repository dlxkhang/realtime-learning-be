import bcrypt from 'bcrypt'
import { USER_ERROR_CODE } from '../../common/error-code'
import { CreateUserDTO } from './dto'
import userModel from './model/user.model'

class UserService {
    async createUser(createUserDto: CreateUserDTO) {
        return userModel.create(createUserDto)
    }

    async getUserByEmail(email: string) {
        try {
            const test = await userModel.findOne({ email })
        } catch (error) {
            console.log(error)
        }
        return userModel.findOne({ email })
    }

    async getUserById(_id: string) {
        return userModel.findById(_id)
    }

    async verifyUser(email: string, password: string) {
        const user = await this.getUserByEmail(email)
        if (!user) return false
        const passwordMatched = await bcrypt.compare(password, user.password)
        if (passwordMatched) return user
    }

    async verifyGoogleToken(email: string) {
        const user = await this.getUserByEmail(email)
        if (!user) return false
        return user
    }
    async verifyTokenPayload(_id: string) {
        const user = await this.getUserById(_id)
        if (!user) return false
        return user
    }

    async getProfileById(_id: string) {
        const user = await this.getUserById(_id)
        if (!user) throw USER_ERROR_CODE.ID_NOT_FOUND
        return {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
        }
    }
}

export default new UserService()
