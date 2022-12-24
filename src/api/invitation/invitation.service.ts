import {
    AcceptInvitationDTO,
    CreateEmailInvitationDTO,
    CreatePresentationInvitationDTO,
    CreateSharedInvitationDTO,
} from './dto'
import userService from '../user/user.service'
import { INVITATION_ERROR_CODE } from '../../common/error-code'
import groupService from '../group/group.service'
import invitationModel from './model/invitation.model'
import { InvitationType } from '../../common/enum'
import { IInvitation, IUser } from '../../interfaces'
import { generateEmailInvitationLink, generatePresentationInvitationLink } from '../../utils'
import templates from '../../common/templates'
import mailService from '../../utils/mail.util'
import presentationService from '../presentation/presentation.service'

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

        if (group.owner !== inviterId.toString()) throw INVITATION_ERROR_CODE.UNAUTHORIZED_INVITER

        await Promise.all(
            inviteeEmails.map(async (inviteeEmail: string) => {
                const session = await invitationModel.startSession()
                session.startTransaction()
                try {
                    const invitation = await invitationModel.create(
                        [
                            {
                                type: InvitationType.EMAIL_INVITATION,
                                inviter: inviterId,
                                group: groupId,
                                inviteeEmail,
                            },
                        ],
                        { session },
                    )

                    const invitationLink = generateEmailInvitationLink(invitation[0]._id)
                    const inviterName = inviter.fullName || inviter.email
                    await mailService.send(
                        templates.invitationEmail(
                            inviteeEmail,
                            inviterName,
                            group.name,
                            invitationLink,
                        ),
                    )

                    await session.commitTransaction()
                    session.endSession()
                } catch (error) {
                    // If an error occurred, abort the whole transaction and
                    // undo any changes that might have happened
                    await session.abortTransaction()
                    session.endSession()

                    throw error
                }
            }),
        )

        return {
            ok: true,
        }
    }

    async createPresentationInvitation(
        createPresentationInvitationDTO: CreatePresentationInvitationDTO,
    ): Promise<{
        ok: true
    }> {
        const { inviterId, presentationId, inviteeEmails } = createPresentationInvitationDTO
        const inviter = await userService.getUserById(inviterId)
        if (!inviter) throw INVITATION_ERROR_CODE.INVITER_NOT_FOUND

        const presentation = await presentationService.getById(presentationId)
        if (!presentation) throw INVITATION_ERROR_CODE.PRESENTATION_ID_NOT_FOUND

        const collaborators = await presentationService.getCollaborators(presentationId)

        const owner = presentation.createBy as IUser
        if (owner._id.toString() !== inviterId.toString())
            throw INVITATION_ERROR_CODE.UNAUTHORIZED_INVITER

        const session = await invitationModel.startSession()
        session.startTransaction()
        await Promise.all(
            inviteeEmails.map(async (inviteeEmail: string) => {
                if (
                    (collaborators && collaborators.find((item) => item.email === inviteeEmail)) ||
                    owner.email === inviteeEmail
                )
                    throw INVITATION_ERROR_CODE.INVITEE_DUPLICATED

                try {
                    const invitation = await invitationModel.create(
                        [
                            {
                                type: InvitationType.EMAIL_INVITATION,
                                inviter: inviterId,
                                presentation: presentationId,
                                inviteeEmail,
                            },
                        ],
                        { session },
                    )

                    const invitationLink = generatePresentationInvitationLink(invitation[0]._id)
                    const inviterName = inviter.fullName || inviter.email
                    await mailService.send(
                        templates.presentationInvitationEmail(
                            inviteeEmail,
                            inviterName,
                            presentation.name,
                            invitationLink,
                        ),
                    )
                } catch (error) {
                    // If an error occurred, abort the whole transaction and
                    // undo any changes that might have happened
                    await session.abortTransaction()
                    session.endSession()
                    throw error
                }
            }),
        )
        await session.commitTransaction()
        session.endSession()
        return {
            ok: true,
        }
    }

    async getPresentationInvitation(invitationId: string): Promise<IInvitation> {
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
                        path: 'presentation',
                        select: 'name description createBy',
                    },
                ],
                lean: true,
            },
        )
        if (!invitation) throw INVITATION_ERROR_CODE.INVITATION_ID_NOT_FOUND

        return invitation
    }

    async validatePresentationInvitation(
        inviteeId: string,
        invitationId: string,
    ): Promise<IInvitation> {
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

        return invitation
    }

    async acceptPresentationInvitation(acceptInvitationDto: AcceptInvitationDTO): Promise<{
        ok: boolean
    }> {
        const { inviteeId, invitationId } = acceptInvitationDto
        const invitation = await this.validatePresentationInvitation(inviteeId, invitationId)

        // Add invited user to the presentation
        await presentationService.addCollaborator(invitation.presentation.toString(), inviteeId)

        await invitationModel.deleteOne({
            _id: invitation._id,
        })
        return { ok: true }
    }
}

export default new InvitationService()
