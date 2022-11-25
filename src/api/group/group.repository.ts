import { GROUP_ERROR_CODE } from '../../common/error-code'
import { IGroupDTO } from '../../interfaces'
import groupModel from './group.model'

class GroupRepository {
    async create(newGroup: IGroupDTO): Promise<IGroupDTO> {
        return await groupModel.create(newGroup)
    }
    async aggregate(pipeline: any[]): Promise<IGroupDTO[]> {
        return await groupModel.aggregate(pipeline)
    }
    async getGroupById(groupId: string): Promise<IGroupDTO> {
        return await groupModel.findById(groupId)
    }

    async getGroupByOwner(ownerId: string): Promise<IGroupDTO[]> {
        if (!ownerId) {
            throw GROUP_ERROR_CODE.MISSING_GROUP_OWNER
        }
        return await groupModel.find({ owner: ownerId, deleted: false })
    }

    async updateById(groupId: string, groupInfo: IGroupDTO): Promise<IGroupDTO> {
        return await groupModel.findByIdAndUpdate(groupId, groupInfo, { new: true })
    }

    async deleteById(groupId: string): Promise<IGroupDTO> {
        return await groupModel.findByIdAndUpdate(groupId, { deleted: true }, { new: true })
    }
}
export default GroupRepository
