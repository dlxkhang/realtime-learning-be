import { GROUP_ERROR_CODE } from './../../common/error-code'
import { RoleImpl } from '../../implementation'
import { IEvent, IGroup, IGroupDTO, IGroupGeneral } from '../../interfaces'
import controllerWrapper from '../../core/controllerWrapper'
import groupService from './group.service'
import { mapToDetail, mapToGeneral } from './mapper'
import { Role, Privilege } from '../../enums'

export default {
    createGroup: controllerWrapper(async (event: IEvent) => {
        const { _id } = event.user
        console.log('user', _id)
        const { name, description, avatar, background } = event.body
        const group: IGroupDTO = await groupService.createGroup(_id, {
            groupName: name,
            groupDescription: description,
            groupAvatar: avatar,
            groupBackground: background,
        })
        const groupGeneral: IGroupGeneral = await mapToGeneral(group)
        return groupGeneral
    }),
    editGroup: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const user = event.user
        const role = await groupService.roleOf(user, groupId)
        const userRole = new RoleImpl(user, role)
        if (userRole.hasPermission(Privilege.EDITING)) {
            const { name, description, avatar, background } = event.body
            const updatedGroup: {
                name?: string
                description?: string
                avatar?: string
                background?: string
            } = {}
            if (name) {
                updatedGroup['name'] = name
            }
            if (description) {
                updatedGroup['description'] = description
            }
            if (avatar) {
                updatedGroup['avatar'] = avatar
            }
            if (background) {
                updatedGroup['background'] = background
            }
            console.log('updatedGroup', updatedGroup)
            const group: IGroupDTO = await groupService.editGroup(groupId, updatedGroup)
            const groupGeneral: IGroupGeneral = await mapToGeneral(group)
            return groupGeneral
        }
        throw GROUP_ERROR_CODE.NOT_HAVING_PERMISSION
    }),
    getGroup: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const user = event.user
        const role = await groupService.roleOf(user, groupId)
        const userRole = new RoleImpl(user, role)
        const group: IGroupDTO = await groupService.getGroup(groupId)
        const groupDetail: IGroup = await mapToDetail(group)
        return {
            group: groupDetail,
            permission: userRole.getPermission(),
        }
    }),
    getGroupOwn: controllerWrapper(async (event: IEvent) => {
        const user = event.user
        const userRole = new RoleImpl(user, Role.ADMINISTRATOR)
        const groups: IGroupDTO[] = await groupService.getGroupOwn(user._id)
        const groupsGeneral: IGroupGeneral[] = await Promise.all(groups.map(mapToGeneral))
        return {
            groups: groupsGeneral,
            permission: userRole.getPermission(),
        }
    }),
    addMember: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const { userId } = event.body
        const user = event.user
        const role = await groupService.roleOf(user, groupId)
        const userRole = new RoleImpl(user, role)
        const group: IGroupDTO = await groupService.addMemberToGroup(groupId, userId)
        const groupDetail: IGroup = await mapToDetail(group)
        return {
            group: groupDetail,
            permission: userRole.getPermission(),
        }
    }),
    removeMember: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const user = event.user
        const role = await groupService.roleOf(user, groupId)
        const userRole = new RoleImpl(user, role)
        if (userRole.hasPermission(Privilege.KICKING)) {
            const { memberId } = event.body
            const group: IGroupDTO = await groupService.removeMemberFromGroup(groupId, memberId)
            const groupDetail: IGroup = await mapToDetail(group)
            return {
                group: groupDetail,
                permission: userRole.getPermission(),
            }
        }
        throw GROUP_ERROR_CODE.NOT_HAVING_PERMISSION
    }),
    getGroupJoined: controllerWrapper(async (event: IEvent) => {
        const user = event.user
        const userRole = new RoleImpl(user, Role.MEMBER)
        const groups: IGroupDTO[] = await groupService.getGroupHasMember(user._id)
        const groupsGeneral: IGroupGeneral[] = await Promise.all(groups.map(mapToGeneral))
        return {
            groups: groupsGeneral,
            permission: userRole.getPermission(),
        }
    }),
    grantRole: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const user = event.user
        const role = await groupService.roleOf(user, groupId)
        const userRole = new RoleImpl(user, role)
        if (userRole.hasPermission(Privilege.GRANTING)) {
            const { memberId } = event.body
            const group: IGroupDTO = await groupService.grantRole(groupId, memberId)
            const groupGeneral: IGroup = await mapToDetail(group)
            return {
                group: groupGeneral,
                permission: userRole.getPermission(),
            }
        }
        throw GROUP_ERROR_CODE.NOT_HAVING_PERMISSION
    }),
    revokeRole: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const user = event.user
        const role = await groupService.roleOf(user, groupId)
        const userRole = new RoleImpl(user, role)
        if (userRole.hasPermission(Privilege.REVOKING)) {
            const { memberId } = event.body
            const group: IGroupDTO = await groupService.revokeRole(groupId, memberId)
            const groupGeneral: IGroup = await mapToDetail(group)
            return {
                group: groupGeneral,
                permission: userRole.getPermission(),
            }
        }
        throw GROUP_ERROR_CODE.NOT_HAVING_PERMISSION
    }),
    deleteGroup: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const user = event.user
        const role = await groupService.roleOf(user, groupId)
        const userRole = new RoleImpl(user, role)
        if (userRole.hasPermission(Privilege.DELETING)) {
            const group = await groupService.deleteGroup(groupId)
            return group
        }
        throw GROUP_ERROR_CODE.NOT_HAVING_PERMISSION
    }),
}
