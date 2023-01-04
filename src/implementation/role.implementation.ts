import { IUser, IMember, IRole } from '../interfaces'
import { Role, Privilege } from '../enums'
const ROLE: {
    [key in Role]: Privilege[]
} = {
    [Role.ADMINISTRATOR]: [
        Privilege.EDITING,
        Privilege.GRANTING,
        Privilege.KICKING,
        Privilege.REVOKING,
        Privilege.DELETING,
        Privilege.INVITING,
        Privilege.PRESENTING,
        Privilege.VIEWING,
    ] as Privilege[],
    [Role.CO_ADMINISTRATOR]: [
        Privilege.EDITING,
        Privilege.KICKING,
        Privilege.INVITING,
        Privilege.PRESENTING,
        Privilege.VIEWING,
    ] as Privilege[],
    [Role.MEMBER]: [Privilege.INVITING, Privilege.VIEWING] as Privilege[],
    [Role.GUEST]: [] as Privilege[],
}
class RoleImpl {
    private member: IMember
    constructor(user: IUser, role: Role) {
        this.member = {
            ...user,
            id: user._id.toString(),
        }
        this.grant(role)
    }
    grant(role: Role): IMember {
        const roleObj: IRole = {
            name: role,
            permission: [],
        }
        Object.assign(this.member, { role: roleObj })
        this.member.role.permission = ROLE?.[role] ?? []
        return this.member
    }
    hasPermission = (privilege: Privilege): boolean => {
        return this.member.role.permission.includes(privilege)
    }
    getMember = (): IMember => {
        return this.member
    }
    getPermission = (): Privilege[] => {
        return this.member.role.permission
    }
    static getRole = (privileges: Privilege[]): Role[] => {
        let roles = Object.keys(ROLE)
            .map((key: Role) => {
                const rolePrivileges = ROLE?.[key] ?? []
                const intersection = rolePrivileges.filter((privilege) =>
                    privileges.includes(privilege),
                )
                if (intersection.length > 0) {
                    return key
                }
            })
            .filter((role) => role)
        return roles
    }
}
export default RoleImpl
