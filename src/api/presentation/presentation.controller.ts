import { IEvent } from '../../interfaces'
import controllerWrapper from '../../core/controllerWrapper'
import presentationRepository from './presentation.repository'
import presentationService from './presentation.service'
import { Option, Presentation, Slide } from '../../interfaces/presentation/presentation.interface'
import { mapToPresentationResponse, mapToSlideResponse, mapToSlideListResponse } from './mapper'

export default {
    createPresentation: controllerWrapper(async (event: IEvent) => {
        const { name, description, createBy } = event.body
        const presentation = await presentationService.create({
            name,
            description,
            createBy,
        } as Presentation)
        const presentationResponse = mapToPresentationResponse(presentation)
        return presentationResponse
    }),
    getPresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id

        const presentation = await presentationService.getById(presentationId)
        return mapToPresentationResponse(presentation)
    }),

    editPresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id
        const { name, description, createBy } = event.body
        const modifiedPresentation = await presentationService.editById(presentationId, {
            name,
            description,
            createBy,
        } as Presentation)
        return mapToPresentationResponse(modifiedPresentation)
    }),

    deletePresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id
        const deletedPresentation = await presentationService.deleteById(presentationId)
        return mapToPresentationResponse(deletedPresentation)
    }),

    addSlide: controllerWrapper(async (event: IEvent) => {
        const { presentationId, text, optionList } = event.body
        const modifiedPresentation = await presentationService.addSlide(presentationId, {
            text,
            optionList,
        } as Slide)
        return mapToSlideListResponse(modifiedPresentation)
    }),

    deleteSlideById: controllerWrapper(async (event: IEvent) => {
        const slideId = event.params.slideId
        const { presentationId } = event.body
        const modifiedPresentation = await presentationService.deleteSlide(presentationId, slideId)
        return mapToSlideListResponse(modifiedPresentation)
    }),

    getSlideList: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.presentationId
        const presentation = await presentationService.getById(presentationId)
        return mapToSlideListResponse(presentation)
    }),

    editSlideById: controllerWrapper(async (event: IEvent) => {
        const slideId = event.params.slideId
        const { presentationId, text, optionList } = event.body
        const modifiedPresentation = await presentationService.editSlide(presentationId, slideId, {
            text,
            optionList,
        } as Slide)
        return mapToSlideListResponse(modifiedPresentation)
    }),
    updateAnswer: controllerWrapper(async (event: IEvent) => {
        const { presentationId, slideId, optionId } = event.body
        const modifiedPresentation = await presentationService.updateAnswer(
            presentationId,
            slideId,
            optionId,
        )
        if (!modifiedPresentation) return { ok: false }
        else return { ok: true }
    }),
    getSlideById: controllerWrapper(async (event: IEvent) => {
        const slideId = event.params.slideId
        const presentationId = event.body.presentationId
        const slide = await presentationService.getSlideById(presentationId, slideId)
        return mapToSlideResponse(slide)
    }),
}
