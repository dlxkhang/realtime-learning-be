import bcrypt from 'bcrypt'
import { USER_ERROR_CODE } from '../../common/error-code'
import { IUser } from '../../interfaces'
import { CreateUserDTO, UpdateProfileDTO } from './dto'
import userModel from './model/user.model'

class UserService {
    async createUser(createUserDto: CreateUserDTO) {
        return userModel.create(createUserDto)
    }

    async getUserByEmail(email: string) {
        return userModel.findOne({ email })
    }

    async getUserById(_id: string) {
        return userModel.findById(_id, {}, { lean: true })
    }

    async verifyUser(email: string, password: string) {
        const user = await this.getUserByEmail(email)
        if (!user) return false
        const passwordMatched = await bcrypt.compare(password, user.password)
        if (passwordMatched) return user
    }

    async verifyTokenPayload(_id: string) {
        const user = await this.getUserById(_id)
        if (!user) return false
        return user
    }

    async getProfileById(_id: string): Promise<IUser> {
        const user = await this.getUserById(_id)
        if (!user) throw USER_ERROR_CODE.ID_NOT_FOUND
        return user
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDTO): Promise<IUser> {
        return await userModel.findOneAndUpdate({ _id: userId }, updateProfileDto)
    }
}

export default new UserService()
