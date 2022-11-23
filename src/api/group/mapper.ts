import { IUser } from '../../interfaces/user/user.interface'
import { IGroup, IGroupDTO } from '../../interfaces'
import userService from '../user/user.service'

const mapFrom = (group: IGroup): IGroupDTO => {
    return {
        _id: group.id,
        name: group?.name,
        description: group?.description,
        avatar: group?.avatar,
        background: group?.background,
        members: group?.members?.map((member) => member._id) ?? [],
        owner: group.owner?._id,
        coOwners: group?.coOwners.map((coOwner) => coOwner?._id) ?? [],
        deleted: false,
    }
}
const mapTo = async (group: IGroupDTO): Promise<IGroup> => {
    const memberIds = group.members ?? []
    const members: IUser[] = await userService.getUserList(memberIds, { password: 0 })
    const coOwnerIds = group.coOwners ?? []
    const coOwners: IUser[] = await userService.getUserList(coOwnerIds, { password: 0 })
    const owner: IUser = await userService.getUserById(group.owner, { password: 0 })
    return {
        id: group?._id,
        name: group?.name,
        description: group?.description,
        avatar: group?.avatar,
        background: group?.background,
        members,
        owner,
        coOwners,
    }
}

export { mapFrom, mapTo }
