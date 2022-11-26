import { IUser } from '../../interfaces'

export const mapTo = (user: IUser): Omit<IUser, '_id' | 'password'> & { id: string } => {
    const { _id, password, ...rest } = user
    return {
        id: _id,
        ...rest,
    }
}
