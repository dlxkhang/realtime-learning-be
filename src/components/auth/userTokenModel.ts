import mongoose from 'mongoose'

interface Token {
    userId: mongoose.Schema.Types.ObjectId
    token: string
    createdAt: Date // 30 days
}
const userTokenSchema = new mongoose.Schema<Token>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
})

const UserToken = mongoose.model('UserToken', userTokenSchema)

export { UserToken }
