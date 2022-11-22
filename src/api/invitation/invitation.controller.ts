import { Request, Response } from 'express'
import { IUser } from '../../interfaces'
import invitationService from './invitation.service'

class InvitationController {
    async findInvitationById(req: Request, res: Response) {
        try {
            const invitation = await invitationService.findInvitationById(req.params.invitationId)
            res.json(invitation)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
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
            res.json(invitation)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
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
            res.json(invitation)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
}

export default new InvitationController()
