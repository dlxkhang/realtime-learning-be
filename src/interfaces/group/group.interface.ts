import { IMember } from './../user'

interface IBaseGroup {
    name: string
    description?: string
    avatar?: string
    background?: string
}
interface IGroupGeneral extends IBaseGroup {
    id: string
    owner: IMember
}
interface IGroup extends IGroupGeneral {
    members?: IMember[]
    coOwners?: IMember[]
}

interface IGroupDTO extends IBaseGroup {
    _id?: string
    owner: string
    members?: string[]
    coOwners?: string[]
    deleted: boolean
}
export { IBaseGroup, IGroup, IGroupDTO, IGroupGeneral }
