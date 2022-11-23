import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { InvitationType } from '../../../common/enum'
import { IInvitation } from '../../../interfaces'
import Group from '../../group/group.model'
import User from '../../user/model/user.model'

const { Schema } = mongoose

const Invitation = new Schema<IInvitation>(
    {
        type: { type: String, enum: InvitationType },

        inviter: { type: Schema.Types.ObjectId, required: true, ref: User.name },

        inviteeEmail: { type: String, required: true },

        group: { type: Schema.Types.ObjectId, required: true, ref: Group.name },

        invitationExpireAt: { type: Date, default: dayjs().add(1, 'days') },
    },
    {
        // assign createAt and updateAt fields to Schema
        timestamps: true,
    },
)

export default mongoose.model('Invitation', Invitation)
Invitation.index({ invitationExpireAt: 1 }, { expireAfterSeconds: 0 }) // This document will be delete when it reach the invitation expired timestamp
