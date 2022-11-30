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
    getPresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id

        const presentation = await presentationService.getById(presentationId)
        return mapToResponse(presentation)
    }),

    editPresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id
        const { name, description, createBy } = event.body
        const modifiedPresentation = await presentationService.editById(presentationId, {
            name,
            description,
            createBy,
        } as Presentation)
        return mapToResponse(modifiedPresentation)
    }),

    deletePresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id
        const deletedPresentation = await presentationService.deleteById(presentationId)
        return mapToResponse(deletedPresentation)
    }),
}
