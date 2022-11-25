import { IGroup, IInvitation } from '../../interfaces'
import { mapTo as groupMapper } from '../group/mapper'
export const mapTo = async (
    invitation: IInvitation,
): Promise<Omit<IInvitation, '_id' | 'group'> & { id: string; group: IGroup }> => {
    const { _id, group, ...rest } = invitation
    const transformedGroup = await groupMapper(group as any)
    return {
        id: _id,
        group: transformedGroup,
        ...rest,
    }
}
