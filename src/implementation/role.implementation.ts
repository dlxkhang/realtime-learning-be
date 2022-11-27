import { IUser, IMember, IRole } from '../interfaces'
import { Role, Privilege } from '../enums'

class RoleImpl {
    private member: IMember
    constructor(user: IUser, role: Role) {
        this.member = user
        this.grant(role)
    }
    grant(role: Role): IMember {
        const roleObj: IRole = {
            name: role,
            permission: [],
        }
        Object.assign(this.member, { role: roleObj })
        switch (role) {
            case Role.ADMINISTRATOR:
                this.member.role.permission = [
                    Privilege.EDITING,
                    Privilege.GRANTING,
                    Privilege.KICKING,
                    Privilege.REVOKING,
                    Privilege.DELETING,
                    Privilege.INVITING,
                ]
                break
            case Role.CO_ADMINISTRATOR:
                this.member.role.permission = [
                    Privilege.EDITING,
                    Privilege.KICKING,
                    Privilege.REVOKING,
                    Privilege.INVITING,
                ]
                break
            case Role.MEMBER:
                this.member.role.permission = [Privilege.INVITING]
                break
            case Role.GUEST:
                this.member.role.permission = []
                break
            default:
                console.log('Role not found')
                break
        }
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
}
export default RoleImpl
