import { IUser } from '../user'

export default interface IEvent {
    params?: any
    query?: any
    body?: any
    user?: IUser
    baseUrl?: string
}
