import { IGroup, IGroupDTO, IInvitation } from '../../interfaces'
import groupService from '../group/group.service'
import { mapToDetail as groupMapper } from '../group/mapper'
export const mapTo = async (
    invitation: IInvitation,
): Promise<Omit<IInvitation, '_id' | 'group'> & { id: string; group: IGroup }> => {
    const { _id, group, ...rest } = invitation
    const groupDto: IGroupDTO = await groupService.getGroup(group.toString())
    const transformedGroup = await groupMapper(groupDto)
    return {
        id: _id,
        group: transformedGroup,
        ...rest,
    }
}
