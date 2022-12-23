import { IUser } from './../../interfaces/user/user.interface'
import { GROUP_ERROR_CODE } from '../../common/error-code'
import { IGroupDTO } from '../../interfaces'
import GroupRepository from './group.repository'
import { Privilege, Role } from '../../enums'
class GroupService {
    private repository: GroupRepository

    constructor() {
        this.repository = new GroupRepository()
    }
    // Public methods
    async roleOf(caller: IUser, groupId: string): Promise<Role> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (group.owner === caller._id.toString()) {
            return Role.ADMINISTRATOR
        }
        if (group.coOwners.includes(caller._id.toString())) {
            return Role.CO_ADMINISTRATOR
        }
        if (group.members.includes(caller._id.toString())) {
            return Role.MEMBER
        }
        return Role.GUEST
    }
    async createGroup(ownerId: string, groupInfo?: any): Promise<IGroupDTO> {
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
        return await this.repository.create(newGroup)
    }
    async editGroup(groupId: string, groupUpdated?: any): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            console.log('Group not found')
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        const updatedGroup = await this.repository.updateById(groupId, groupUpdated)
        return updatedGroup
    }
    async getGroupHasMember(memberId: string): Promise<IGroupDTO[]> {
        const pipeline = [
            {
                $match: {
                    deleted: false,
                },
            },
            {
                $addFields: {
                    memberId: '$members',
                },
            },
            {
                $unwind: {
                    path: '$memberId',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    members: memberId.toString(),
                },
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    description: { $first: '$description' },
                    avatar: { $first: '$avatar' },
                    background: { $first: '$background' },
                    owner: { $first: '$owner' },
                    members: { $first: '$members' },
                    coOwners: { $first: '$coOwners' },
                },
            },
        ]
        const groups: IGroupDTO[] = await this.repository.aggregate(pipeline)
        return groups
    }
    async getGroup(groupId: string): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        return group
    }

    async getGroupOwn(ownerId: string): Promise<IGroupDTO[]> {
        const groups: IGroupDTO[] = await this.repository.getGroupByOwner(ownerId)
        return groups
    }

    async addMemberToGroup(groupId: string, memberId: string): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.members) {
            group.members = []
        }
        if (
            group.members.includes(memberId) ||
            group.coOwners.includes(memberId) ||
            group.owner === memberId
        ) {
            throw GROUP_ERROR_CODE.MEMBER_ALREADY_IN_GROUP
        }
        group.members.push(memberId)
        return await this.repository.updateById(groupId, group)
    }

    async removeMemberFromGroup(groupId: string, memberId: string): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.members) {
            group.members = []
        }
        if (group.coOwners.includes(memberId)) {
            throw GROUP_ERROR_CODE.CANNOT_REMOVE_CO_OWNER
        }
        console.log('memberId', memberId)
        console.log('group.members', group.members)
        if (!group.members.includes(memberId)) {
            throw GROUP_ERROR_CODE.MEMBER_NOT_IN_GROUP
        }
        group.members = group.members.filter((member) => member !== memberId)
        return await this.repository.updateById(groupId, group)
    }

    async grantRole(groupId: string, memberId: string): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.members.includes(memberId)) {
            throw GROUP_ERROR_CODE.MEMBER_NOT_IN_GROUP
        }
        if (group.coOwners.includes(memberId)) {
            throw GROUP_ERROR_CODE.MEMBER_ALREADY_CO_OWNER
        }
        group.members = group.members.filter((member) => member !== memberId)
        group.coOwners.push(memberId)
        return await this.repository.updateById(groupId, group)
    }

    async revokeRole(groupId: string, memberId: string): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        if (!group.coOwners.includes(memberId)) {
            throw GROUP_ERROR_CODE.MEMBER_NOT_CO_OWNER
        }
        group.coOwners = group.coOwners.filter((coOwner) => coOwner !== memberId)
        group.members.push(memberId)
        return await this.repository.updateById(groupId, group)
    }

    async deleteGroup(groupId: string): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            console.log('Group not found')
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        return await this.repository.deleteById(groupId)
    }

    async isMemberOfGroup(groupId: string, memberId: string): Promise<boolean> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }
        return group.members.includes(memberId)
    }
    async startPresenting(groupId: string, presentationId: string): Promise<IGroupDTO> {
        const group: IGroupDTO = await this.repository.getGroupById(groupId)
        if (!group) {
            throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
        }

        if (group.presenting) {
            throw GROUP_ERROR_CODE.ALREADY_HAS_PRESENTING_SLIDE
        } else {
            group.presenting = presentationId
        }
        return await this.repository.updateById(groupId, group)
    }
    async stopPresentingForGroups(presentationId: string) {
        const groups: IGroupDTO[] = await this.repository.find({
            presenting: presentationId,
        })
        for (const group of groups) {
            group.presenting = undefined
            await this.repository.updateById(group._id, group)
        }
    }
}
export default new GroupService()
