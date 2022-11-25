import { AcceptInvitationDTO, CreateEmailInvitationDTO, CreateSharedInvitationDTO } from './dto'
import userService from '../user/user.service'
import { INVITATION_ERROR_CODE } from '../../common/error-code'
import groupService from '../group/group.service'
import invitationModel from './model/invitation.model'
import { InvitationType } from '../../common/enum'
import { IInvitation } from '../../interfaces'
import { generateEmailInvitationLink } from '../../utils'
import templates from '../../common/templates'
import mailService from '../../utils/mail.util'

class InvitationService {
    async getInvitation(
        userId: string,
        invitationId: string,
    ): Promise<{
        invitation: IInvitation
        isMemberOfGroup: boolean
    }> {
        const invitation = await invitationModel.findById(
            invitationId,
            {},
            {
                populate: [
                    {
                        path: 'inviter',
                        select: 'fullName avatar',
                    },
                    {
                        path: 'group',
                        select: 'name description avatar',
                    },
                ],
                lean: true,
            },
        )
        if (!invitation) throw INVITATION_ERROR_CODE.INVITATION_ID_NOT_FOUND

        const isMemberOfGroup = await groupService.isMemberOfGroup(
            invitation.group._id.toString(),
            userId,
        )
        if (isMemberOfGroup)
            return {
                invitation,
                isMemberOfGroup: true,
            }

        return {
            invitation,
            isMemberOfGroup: false,
        }
    }

    async createSharedInvitation(
        createSharedInvitationDTO: CreateSharedInvitationDTO,
    ): Promise<IInvitation> {
        const { inviterId, groupId } = createSharedInvitationDTO
        const inviter = await userService.getUserById(inviterId)
        if (!inviter) throw INVITATION_ERROR_CODE.INVITER_NOT_FOUND

        const group = await groupService.getGroup(groupId)
        if (!group) throw INVITATION_ERROR_CODE.GROUP_ID_NOT_FOUND

        if (group.owner._id.toString() !== inviterId.toString())
            throw INVITATION_ERROR_CODE.UNAUTHORIZED_INVITER

        const invitation = await invitationModel.findOne(
            {
                inviter: inviterId,
                group: groupId,
            },
            {},
            { lean: true },
        )
        if (invitation)
            // If invitation exist and hasn't expired yet => return it, else create a new one
            return invitation

        const newInvitation = await invitationModel.create({
            type: InvitationType.SHARED_INVITATION,
            inviter: inviterId,
            group: groupId,
        })
        console.log('newInvitation.toObject(): ', newInvitation.toObject())
        return newInvitation.toObject()
    }

    async validateInvitation(inviteeId: string, invitationId: string): Promise<IInvitation> {
        const invitation = await invitationModel.findById(invitationId, {}, {})
        if (!invitation) throw INVITATION_ERROR_CODE.INVITATION_ID_NOT_FOUND

        const invitee = await userService.getUserById(inviteeId)
        if (!invitee) throw INVITATION_ERROR_CODE.INVITEE_NOT_FOUND
        if (
            invitation.type === InvitationType.EMAIL_INVITATION &&
            invitee.email !== invitation.inviteeEmail
        )
            throw INVITATION_ERROR_CODE.INVALID_INVITEE_EMAIL

        if (invitation.inviter.toString() === inviteeId)
            throw INVITATION_ERROR_CODE.INVITER_DUPLICATED

        // Check if invitee already joined the group
        const isMemberOfGroup = await groupService.isMemberOfGroup(
            invitation.group.toString(),
            inviteeId,
        )

        if (isMemberOfGroup) throw INVITATION_ERROR_CODE.INVITEE_DUPLICATED

        return invitation
    }

    async acceptInvitation(acceptInvitationDto: AcceptInvitationDTO): Promise<IInvitation> {
        const { inviteeId, invitationId } = acceptInvitationDto
        const invitation = await this.validateInvitation(inviteeId, invitationId)

        // Add invited user to the group
        await groupService.addMemberToGroup(invitation.group.toString(), inviteeId)

        return invitation
    }

    async createEmailInvitations(createEmailInvitationDto: CreateEmailInvitationDTO): Promise<{
        ok: true
    }> {
        const { inviterId, groupId, inviteeEmails } = createEmailInvitationDto
        const inviter = await userService.getUserById(inviterId)
        if (!inviter) throw INVITATION_ERROR_CODE.INVITER_NOT_FOUND

        const group = await groupService.getGroup(groupId)
        if (!group) throw INVITATION_ERROR_CODE.GROUP_ID_NOT_FOUND

        if (group.owner._id.toString() !== inviterId.toString())
            throw INVITATION_ERROR_CODE.UNAUTHORIZED_INVITER

        await Promise.all(
            inviteeEmails.map(async (inviteeEmail: string) => {
                const invitation = await invitationModel.create({
                    type: InvitationType.EMAIL_INVITATION,
                    inviter: inviterId,
                    group: groupId,
                    inviteeEmail,
                })

                const invitationLink = generateEmailInvitationLink(invitation._id)
                const inviterName = inviter.fullName || inviter.email
                return await mailService.send(
                    templates.invitationEmail(
                        inviteeEmail,
                        inviterName,
                        group.name,
                        invitationLink,
                    ),
                )
            }),
        )

        return {
            ok: true,
        }
    }
}

export default new InvitationService()
