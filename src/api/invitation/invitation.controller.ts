import { Request, Response } from 'express'
import { IUser } from '../../interfaces'
import invitationService from './invitation.service'
import { mapTo } from './mapper'

class InvitationController {
    async findInvitationById(req: Request, res: Response) {
        try {
            const invitation = await invitationService.findInvitationById(req.params.id)
            res.json(mapTo(invitation))
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
            res.json(mapTo(invitation))
        } catch (err) {
            console.log(err)
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
            res.json(mapTo(invitation))
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).send(
                err.statusCode ? err.message : 'Internal Server Error',
            )
        }
    }
}

export default new InvitationController()
