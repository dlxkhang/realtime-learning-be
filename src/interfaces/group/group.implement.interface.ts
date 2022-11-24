import { IUser } from '../user/user.interface'

export default interface IGroup {
    id?: string
    name: string
    description?: string
    avatar?: string
    background?: string
    members?: IUser[]
    owner?: IUser
    coOwners?: IUser[]
}
