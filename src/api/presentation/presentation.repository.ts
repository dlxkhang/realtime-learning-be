import { Presentation, Slide } from '../../interfaces/presentation/presentation.interface'
import presentationModel from './presentation.model'

class PresentationRepository {
    async create(newPresenation: Presentation) {
        return (
            await (
                await presentationModel.create(newPresenation)
            ).populate({
                path: 'createBy',
                select: 'fullName avatar',
            })
        ).toObject()
    }

    async editById(
        presentationId: string,
        EditedPresentation: Presentation,
    ): Promise<Presentation> {
        return await presentationModel.findByIdAndUpdate(presentationId, EditedPresentation, {
            new: true,
        })
    }

    async getPrentationById(presentationId: string): Promise<Presentation> {
        return await presentationModel.findById(
            presentationId,
            {},
            {
                populate: [
                    {
                        path: 'createBy',
                        select: 'fullName avatar',
                    },
                ],
                lean: true,
            },
        )
    }

    async deleteById(presentationId: string): Promise<Presentation> {
        return await presentationModel.findByIdAndDelete(presentationId)
    }
}

export default new PresentationRepository()
