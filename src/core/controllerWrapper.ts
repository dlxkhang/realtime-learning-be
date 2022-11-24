import { Request, Response } from 'express'
import { IUser, IEvent } from '../interfaces'

export default (controller: (req: IEvent) => any) => {
    return async (req: Request, res: Response) => {
        const event: IEvent = {
            params: req.params,
            query: req.query,
            body: req.body,
            baseUrl: req.baseUrl,
        }
        if (req.user) {
            event.user = req.user as IUser
        }
        try {
            const result = await controller(event)
            res.json(result)
        } catch (error) {
            res.status(error.statusCode ? error.statusCode : 500).send(error.statusCode ? error.message : 'Internal Server Error')
        }
    }
}
