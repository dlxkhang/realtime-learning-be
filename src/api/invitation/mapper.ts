import { Types } from 'mongoose'
import { IGroup, IInvitation, IUser } from '../../interfaces'
import { mapToDetail as groupMapper } from '../group/mapper'
import { mapTo as userMapper } from '../user/mapper'

export const mapTo = async (
    invitation: IInvitation,
): Promise<
    Omit<IInvitation, '_id' | 'group' | 'inviter'> & {
        id: string
        group: IGroup | Types.ObjectId
        inviter: IUser | Types.ObjectId
    }
> => {
    const { _id, group, inviter, ...rest } = invitation
    let transformedGroup
    let transformedInviter
    if (!(group instanceof Types.ObjectId)) {
        transformedGroup = await groupMapper(group as any)
    }
    if (!(inviter instanceof Types.ObjectId)) {
        transformedInviter = userMapper(inviter as any)
    }

    return {
        id: _id,
        group: transformedGroup,
        inviter: transformedInviter,
        ...rest,
    }
}
