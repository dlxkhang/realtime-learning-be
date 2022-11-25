import { Request, Response } from 'express'
import { IUser } from '../../interfaces'
import invitationService from './invitation.service'
import { mapTo } from './mapper'

class InvitationController {
    async getInvitation(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const { invitation, ...rest } = await invitationService.getInvitation(
                _id,
                req.params.id,
            )
            const transformedInvitation = await mapTo(invitation)
            res.json({
                invitation: transformedInvitation,
                ...rest,
            })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.message ? err.message : 'Internal Server Error',
            )
        }
    }

    async createSharedInvitation(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const invitation = await invitationService.createSharedInvitation({
                inviterId: _id,
                groupId: req.body.groupId,
            })
            const transformedInvitation = await mapTo(invitation)
            res.json(transformedInvitation)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.message ? err.message : 'Internal Server Error',
            )
        }
    }

    async createEmailInvitations(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const status = await invitationService.createEmailInvitations({
                inviterId: _id,
                groupId: req.body.groupId,
                inviteeEmails: req.body.inviteeEmails,
            })
            res.json(status)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.message ? err.message : 'Internal Server Error',
            )
        }
    }

    async acceptInvitation(req: Request, res: Response) {
        try {
            const { _id } = req.user as IUser
            const invitation = await invitationService.acceptInvitation({
                inviteeId: _id,
                invitationId: req.body.invitationId,
            })
            const transformedInvitation = await mapTo(invitation)
            res.json(transformedInvitation)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
}

export default new InvitationController()
