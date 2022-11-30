import { IEvent } from '../../interfaces'
import controllerWrapper from '../../core/controllerWrapper'
import presentationRepository from './presentation.repository'
import presentationService from './presentation.service'
import { Presentation } from '../../interfaces/presentation/presentation.interface'
import { mapToResponse } from './mapper'

export default {
    createPresentation: controllerWrapper(async (event: IEvent) => {
        const { name, description, createBy } = event.body
        const presentation = await presentationService.create({
            name,
            description,
            createBy,
        } as Presentation)
        const presentationResponse = mapToResponse(presentation)
        return presentationResponse
    }),
}
