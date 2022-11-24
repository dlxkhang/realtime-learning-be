export default interface IGroupDTO {
    _id?: string
    name: string
    description?: string
    avatar?: string
    background?: string
    members?: string[]
    owner: string
    coOwners?: string[]
    deleted: boolean
}
