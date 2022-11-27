import { IUser } from '../../interfaces/user/user.interface'
import { IGroup, IGroupDTO, IGroupGeneral } from '../../interfaces'
import userService from '../user/user.service'
import { RoleImpl } from '../../implementation'
import { Role } from '../../enums'

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
const mapToGeneral = async (group: IGroupDTO): Promise<IGroupGeneral> => {
    const owner: IUser = await userService.getUserById(group.owner, { password: 0 })
    return {
        id: group?._id,
        name: group?.name,
        description: group?.description,
        avatar: group?.avatar,
        background: group?.background,
        owner: new RoleImpl(owner, Role.ADMINISTRATOR).getMember(),
    }
}
const mapToDetail = async (group: IGroupDTO): Promise<IGroup> => {
    const owner: IUser = await userService.getUserById(group.owner, { password: 0 })
    const members: IUser[] = await userService.getUserList(group.members, { password: 0 })
    const coOwners: IUser[] = await userService.getUserList(group.coOwners, { password: 0 })

    return {
        id: group?._id,
        name: group?.name,
        description: group?.description,
        avatar: group?.avatar,
        background: group?.background,
        owner: owner ? new RoleImpl(owner, Role.ADMINISTRATOR).getMember() : undefined,
        members: members.map((member) => new RoleImpl(member, Role.MEMBER).getMember()),
        coOwners: coOwners.map((coOwner) =>
            new RoleImpl(coOwner, Role.CO_ADMINISTRATOR).getMember(),
        ),
    }
}

export { mapFrom, mapToGeneral, mapToDetail }
