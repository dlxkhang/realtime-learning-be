import { IEvent } from '../../interfaces'
import controllerWrapper from '../../core/controllerWrapper'
import presentationRepository from './presentation.repository'
import presentationService from './presentation.service'
import {
    Option,
    Presentation,
    QnAQuestion,
    Slide,
} from '../../interfaces/presentation/presentation.interface'
import { mapToPresentationResponse, mapToSlideResponse, mapToSlideListResponse } from './mapper'
import { IMessage } from '../../interfaces/message/message.interface'

export default {
    createPresentation: controllerWrapper(async (event: IEvent) => {
        const { name, description } = event.body
        const createBy = event.user._id.toString()
        const presentation = await presentationService.create({
            name,
            description,
            createBy,
        } as Presentation)
        return mapToPresentationResponse(presentation)
    }),
    getPresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id

        const presentation = await presentationService.getById(presentationId)
        return mapToPresentationResponse(presentation)
    }),

    editPresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id
        const createBy = event.user._id.toString()
        const { name, description } = event.body
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
        const { presentationId, slideId } = event.params
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
        const { presentationCode, optionId } = event.body
        const modifiedPresentation = await presentationService.updateAnswer(
            presentationCode,
            optionId,
        )
        if (!modifiedPresentation) return { ok: false }
        else return { ok: true }
    }),
    getPresentingSlide: controllerWrapper(async (event: IEvent) => {
        const { presentationCode } = event.params
        const slide = await presentationService.getPresentingSlide(presentationCode)
        return mapToSlideResponse(slide)
    }),
    // get list of presentation by user id
    getPresentationListByUserId: controllerWrapper(async (event: IEvent) => {
        const userId = event.user._id.toString()
        const presentationList = await presentationService.getPresentationListByUserId(userId)
        return presentationList.map((presentation) => mapToPresentationResponse(presentation))
    }),

    updatePresentStatus: controllerWrapper(async (event: IEvent) => {
        const { presentationId, slideId, isPresenting } = event.body
        const slide = await presentationService.updatePresentStatus(
            presentationId,
            slideId,
            isPresenting,
        )
        return mapToSlideResponse(slide)
    }),

    addAnonymousMessage: controllerWrapper(async (event: IEvent) => {
        const { presentationCode, message } = event.body
        const anonymousMessage: IMessage = {
            title: 'Anonymous',
            text: message,
            date: new Date(),
        }
        const messages = await presentationService.addMessage(presentationCode, anonymousMessage)
        return messages
    }),

    addAuthenticatedMessage: controllerWrapper(async (event: IEvent) => {
        const { fullName } = event.user
        const { presentationCode, message } = event.body
        const authenticatedMessage: IMessage = {
            title: fullName,
            text: message,
            date: new Date(),
        }
        const messages = await presentationService.addMessage(
            presentationCode,
            authenticatedMessage,
        )
        return messages
    }),

    getMessages: controllerWrapper(async (event: IEvent) => {
        const { presentationCode } = event.params
        const { page, pageSize } = event.query
        const messages = await presentationService.getMessages(presentationCode, { page, pageSize })
        return messages
    }),

    addAnonymousQnAQuestion: controllerWrapper(async (event: IEvent) => {
        const { presentationCode, qnaQuestion } = event.body
        const anonymousQuestion: QnAQuestion = {
            question: qnaQuestion.question,
            date: new Date(),
            isAnswered: false,
            likeCount: 0,
        }
        const questions = await presentationService.addQnAQuestion(
            presentationCode,
            anonymousQuestion,
        )
        return questions
    }),

    getQnaQuestionList: controllerWrapper(async (event: IEvent) => {
        const { presentationCode } = event.params
        const { page, pageSize } = event.query
        const questions = await presentationService.getQnAQuesionList(presentationCode, {
            page,
            pageSize,
        })
        return questions
    }),

    updateQnAQuestionLikeCount: controllerWrapper(async (event: IEvent) => {
        const { presentationCode, qnaQuestion } = event.body
        const questions = await presentationService.updateQnAQuestion(presentationCode, qnaQuestion)
        return questions
    }),
}
