import { IEvent, IGroup } from '../../interfaces'
import controllerWrapper from '../../core/controllerWrapper'
import groupService from './group.service'

export default {
    createGroup: controllerWrapper(async (event: IEvent) => {
        const { _id } = event.user
        console.log('user', _id)
        const { name, description, avatar, background } = event.body
        const group: IGroup = await groupService.createGroup(_id, {
            groupName: name,
            groupDescription: description,
            groupAvatar: avatar,
            groupBackground: background,
        })
        return group
    }),
    editGroup: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const { _id } = event.user
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
        const group: IGroup = await groupService.editGroup(groupId, _id, updatedGroup)
        return group
    }),
    getGroup: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const group: IGroup = await groupService.getGroup(groupId)
        return group
    }),
    getGroupOwn: controllerWrapper(async (event: IEvent) => {
        const { _id } = event.user
        const groups: IGroup[] = await groupService.getGroupOwn(_id)
        return {
            groups,
        }
    }),
    addMember: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.addMemberToGroup(groupId, userId)
        return group
    }),
    removeMember: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.removeMemberFromGroup(groupId, userId)
        return group
    }),
    getGroupJoined: controllerWrapper(async (event: IEvent) => {
        const { _id } = event.user
        const groups: IGroup[] = await groupService.getGroupHasMember(_id)
        return {
            groups,
        }
    }),
    addCoOwner: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.addCoOwnerToGroup(groupId, userId)
        return group
    }),
    removeCoOwner: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.removeCoOwnerFromGroup(groupId, userId)
        return group
    }),
    deleteGroup: controllerWrapper(async (event: IEvent) => {
        const { groupId } = event.params
        const { _id } = event.user
        const group: IGroup = await groupService.deleteGroup(groupId, _id)
        return group
    }),
}
