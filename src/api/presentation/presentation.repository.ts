import { Presentation } from '../../interfaces/presentation/presentation.interface'
import presentationModel from './presentation.model'

class PresentationRepository {
    async create(newPresenation: Presentation): Promise<Presentation> {
        return await presentationModel.create(newPresenation)
    }

    async editById(
        presentationId: string,
        EditedPresentation: Presentation,
    ): Promise<Presentation> {
        return presentationModel.findByIdAndUpdate(presentationId, EditedPresentation, {
            new: true,
        })
    }

    async getById(presentationId: string): Promise<Presentation> {
        return presentationModel.findById(presentationId)
    }

    async deleteById(presentationId: string): Promise<Presentation> {
        return presentationModel.findByIdAndDelete(presentationId)
    }
}

export default new PresentationRepository()
