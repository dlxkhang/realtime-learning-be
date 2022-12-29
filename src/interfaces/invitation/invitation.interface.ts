import { Types } from 'mongoose'
import { InvitationType } from '../../common/enum'

export interface IInvitation {
    _id?: string

    type: InvitationType

    inviter: Types.ObjectId

    inviteeEmail: string

    group?: Types.ObjectId

    presentation?: Types.ObjectId

    invitationExpireAt: Date
}
