import { Types } from 'mongoose'
import { IGroup, IInvitation, IUser } from '../../interfaces'
import { PresentationResponse } from '../../interfaces/presentation/presentation.interface'
import { mapToDetail as groupMapper } from '../group/mapper'
import { mapToPresentationResponse } from '../presentation/mapper'
import { mapTo as userMapper } from '../user/mapper'

export const mapTo = async (
    invitation: IInvitation,
): Promise<
    Omit<IInvitation, '_id' | 'group' | 'presentation' | 'inviter'> & {
        id: string
        group: IGroup | Types.ObjectId
        presentation: PresentationResponse | Types.ObjectId
        inviter: IUser | Types.ObjectId
    }
> => {
    const { _id, group, presentation, inviter, ...rest } = invitation
    let transformedGroup: any = group
    let transformedPresentation: any = presentation
    let transformedInviter: any = inviter
    if (group && !(group instanceof Types.ObjectId)) {
        transformedGroup = await groupMapper(group as any)
    }
    if (presentation && !(presentation instanceof Types.ObjectId)) {
        transformedPresentation = mapToPresentationResponse(presentation as any)
    }

    if (!(inviter instanceof Types.ObjectId)) {
        transformedInviter = userMapper(inviter as any)
    }

    return {
        id: _id,
        group: transformedGroup,
        presentation: transformedPresentation,
        inviter: transformedInviter,
        ...rest,
    }
}
