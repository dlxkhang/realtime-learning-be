import { IEvent, IGroup } from '../../interfaces'
import controllerWrapper from '../../core/controllerWrapper'
import groupService from './group.service'

export default {
    createGroup: controllerWrapper(async (event: IEvent) => {
        const { _id } = event.user
        const { name, description, avatar, background } = event.body
        const group: IGroup = await groupService.createGroup(_id, {
            groupName: name,
            groupDescription: description,
            groupAvatar: avatar,
            groupBackground: background,
        })
        return group
    }),
    getGroup: controllerWrapper(async (event: IEvent) => {
        const { id } = event.params
        const group: IGroup = await groupService.getGroup(id)
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
        const { id } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.addMemberToGroup(id, userId)
        return group
    }),
    removeMember: controllerWrapper(async (event: IEvent) => {
        const { id } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.removeMemberFromGroup(id, userId)
        return group
    }),
    addCoOwner: controllerWrapper(async (event: IEvent) => {
        const { id } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.addCoOwnerToGroup(id, userId)
        return group
    }),
    removeCoOwner: controllerWrapper(async (event: IEvent) => {
        const { id } = event.params
        const { userId } = event.body
        const group: IGroup = await groupService.removeCoOwnerFromGroup(id, userId)
        return group
    }),
    deleteGroup: controllerWrapper(async (event: IEvent) => {
        const { id } = event.params
        const group: IGroup = await groupService.deleteGroup(id)
        return group
    }),
}
