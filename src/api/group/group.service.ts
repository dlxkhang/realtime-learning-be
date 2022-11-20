import { GROUP_ERROR_CODE } from '../../common/error-code'
import { IGroup, IGroupDTO } from '../../interfaces'
import { mapTo } from './mapper'
import GroupRepository from './group.repository'

class GroupService {
    private repository: GroupRepository

    constructor() {
        this.repository = new GroupRepository()
    }

    // Public methods
    async createGroup(ownerId: string, groupInfo?: any): Promise<IGroup> {
        const { groupName, groupDescription, groupAvatar, groupBackground } = groupInfo
        if (!groupName) {
            throw GROUP_ERROR_CODE.MISSING_GROUP_NAME
        }
        if (!ownerId) {
            throw GROUP_ERROR_CODE.MISSING_GROUP_OWNER
        }
        const newGroup: IGroupDTO = {
            name: groupName,
            description: groupDescription,
            avatar: groupAvatar,
            background: groupBackground,
            members: [],
            owner: ownerId,
            coOwners: [],
            deleted: false,
        }
        return mapTo(await this.repository.create(newGroup))
    }

    async getGroup(groupId: string): Promise<IGroup> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        return mapTo(group)
    }

    async getGroupOwn(ownerId: string): Promise<IGroup[]> {
        const groups: IGroupDTO[] = await this.repository.getGroupByOwner(ownerId)
        return Promise.all(groups.map(async (group) => mapTo(group)))
    }

    async addMemberToGroup(groupId: string, memberId: string): Promise<IGroup> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.members) {
            group.members = []
        }
        if (group.members.includes(memberId)) {
            throw GROUP_ERROR_CODE.MEMBER_ALREADY_IN_GROUP
        }
        group.members.push(memberId)
        return mapTo(await this.repository.updateById(groupId, group))
    }

    async removeMemberFromGroup(groupId: string, memberId: string): Promise<IGroup> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.members) {
            group.members = []
        }
        if (!group.members.includes(memberId)) {
            throw GROUP_ERROR_CODE.MEMBER_NOT_IN_GROUP
        }
        group.members = group.members.filter((member) => member !== memberId)
        return mapTo(await this.repository.updateById(groupId, group))
    }

    async addCoOwnerToGroup(groupId: string, coOwnerId: string): Promise<IGroup> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.coOwners) {
            group.coOwners = []
        }
        if (group.coOwners.includes(coOwnerId)) {
            throw GROUP_ERROR_CODE.CO_OWNER_ALREADY_IN_GROUP
        }
        group.coOwners.push(coOwnerId)
        return mapTo(await this.repository.updateById(groupId, group))
    }

    async removeCoOwnerFromGroup(groupId: string, coOwnerId: string): Promise<IGroup> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.coOwners) {
            group.coOwners = []
        }
        if (!group.coOwners.includes(coOwnerId)) {
            throw GROUP_ERROR_CODE.CO_OWNER_NOT_IN_GROUP
        }
        group.coOwners = group.coOwners.filter((coOwner) => coOwner !== coOwnerId)
        return mapTo(await this.repository.updateById(groupId, group))
    }

    async deleteGroup(groupId: string): Promise<IGroup> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        return mapTo(await this.repository.deleteById(groupId))
    }
}
export default new GroupService()
