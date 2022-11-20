import mongoose from 'mongoose'
import { IGroupDTO } from '../../interfaces'

const { Schema } = mongoose

const Group = new Schema<IGroupDTO>(
    {
        name: { type: String, unique: true, required: true },
        description: { type: String, required: false },
        avatar: { type: String, required: false },
        background: { type: String, required: false },
        members: [{ type: String, required: true }],
        owner: { type: String, required: true },
        coOwners: [{ type: String, required: true }],
        deleted: { type: Boolean, required: true, default: false },
    },
    {
        // assign createAt and updateAt fields to Schema
        timestamps: true,
    },
)

export default mongoose.model('Groups', Group)
