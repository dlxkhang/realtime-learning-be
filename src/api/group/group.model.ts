import mongoose from 'mongoose'
import constants from '../../constants'
import { IGroupDTO } from '../../interfaces'

const { Schema } = mongoose

const Group = new Schema<IGroupDTO>(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        avatar: { type: String, required: false, default: constants.DEFAULT_IMAGE.AVATAR },
        background: { type: String, required: false, default: constants.DEFAULT_IMAGE.BACKGROUND },
        members: [{ type: String, required: true }],
        owner: { type: String, required: true },
        coOwners: [{ type: String, required: true }],
        deleted: { type: Boolean, required: true, default: false },
        presenting: { type: String, required: false },
    },
    {
        // assign createAt and updateAt fields to Schema
        timestamps: true,
    },
)

export default mongoose.model('Groups', Group)
