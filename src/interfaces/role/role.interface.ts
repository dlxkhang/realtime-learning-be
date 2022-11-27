import { Role, Privilege } from '../../enums'

export default interface IRole {
    name: Role
    permission: Privilege[]
}
