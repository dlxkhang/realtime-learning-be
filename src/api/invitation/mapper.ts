import { IInvitation } from '../../interfaces'

export const mapTo = async (
    invitation: IInvitation,
): Promise<Omit<IInvitation, '_id'> & { id: string }> => {
    const { _id, ...rest } = invitation
    return {
        id: _id,
        ...rest,
    }
}
