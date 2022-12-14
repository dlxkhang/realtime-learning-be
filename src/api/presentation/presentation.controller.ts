import { PresentationEvent } from './../socket/event'
import { RoleImpl } from '../../implementation'
import { Access, Privilege, SlideType } from '../../enums'
import { IEvent, IUser } from '../../interfaces'
import controllerWrapper from '../../core/controllerWrapper'
import { mapTo as userMapper } from '../user/mapper'
import {
    IHeadingSlide,
    IMultipleChoiceSlide,
    IParagraphSlide,
} from '../../interfaces/presentation/presentation.interface'
import groupService from '../group/group.service'
import { GROUP_ERROR_CODE, PRESENTATION_ERROR_CODE } from './../../common/error-code'
import socketService from '../socket/socket.service'
import presentationRepository from './presentation.repository'
import presentationService from './presentation.service'
import {
    Option,
    Presentation,
    QnAQuestion,
    Slide,
} from '../../interfaces/presentation/presentation.interface'
import {
    mapToPresentationResponse,
    mapToSlideResponse,
    mapToSlideListResponse,
    mapToQnAQuestionResponse,
    mapToAnswerInfoResponse,
} from './mapper'
import { IMessage } from '../../interfaces/message/message.interface'
import mongoose from 'mongoose'

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
        // const createBy = event.user._id.toString()
        const { name, description } = event.body
        const modifiedPresentation = await presentationService.editById(presentationId, {
            name,
            description,
            // createBy,
        } as Presentation)
        return mapToPresentationResponse(modifiedPresentation)
    }),

    deletePresentationById: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.id
        const deletedPresentation = await presentationService.deleteById(presentationId)
        return mapToPresentationResponse(deletedPresentation)
    }),

    addSlide: controllerWrapper(async (event: IEvent) => {
        const { presentationId, type, data } = event.body
        if (!type) {
            throw PRESENTATION_ERROR_CODE.MISSING_SLIDE_TYPE
        }
        let newSlide: Slide = {
            type: type,
        }
        const modifiedPresentation = await presentationService.addSlide(presentationId, newSlide)
        return mapToSlideListResponse(modifiedPresentation.slideList)
    }),

    deleteSlideById: controllerWrapper(async (event: IEvent) => {
        const { presentationId, slideId } = event.params
        const modifiedPresentation = await presentationService.deleteSlide(presentationId, slideId)
        return mapToSlideListResponse(modifiedPresentation.slideList)
    }),

    getSlideList: controllerWrapper(async (event: IEvent) => {
        const presentationId = event.params.presentationId
        const { page, pageSize } = event.query
        const presentation = await presentationService.getById(presentationId)
        const slideList = presentation.slideList.slice((page - 1) * pageSize, page * pageSize)
        return mapToSlideListResponse(slideList)
    }),

    editSlideById: controllerWrapper(async (event: IEvent) => {
        const slideId = event.params.slideId
        const { presentationId, type, data } = event.body
        if (!type) {
            throw PRESENTATION_ERROR_CODE.MISSING_SLIDE_TYPE
        }
        let updatedSlide: Slide = {
            type: type,
        }
        switch (type) {
            case SlideType.MULTIPLE_CHOICE: {
                const { text, optionList } = data
                updatedSlide = {
                    ...updatedSlide,
                    text,
                    optionList,
                } as IMultipleChoiceSlide
                break
            }
            case SlideType.HEADING: {
                const { heading, subHeading } = data
                updatedSlide = {
                    ...updatedSlide,
                    heading: heading,
                    subHeading,
                } as IHeadingSlide
                break
            }
            case SlideType.PARAGRAPH: {
                const { heading, paragraph } = data
                updatedSlide = {
                    ...updatedSlide,
                    heading,
                    paragraph,
                } as IParagraphSlide
                break
            }
            default:
                throw PRESENTATION_ERROR_CODE.NOT_SUPPORTED_SLIDE_TYPE
        }
        const modifiedPresentation = await presentationService.editSlide(
            presentationId,
            slideId,
            updatedSlide,
        )
        return mapToSlideListResponse(modifiedPresentation.slideList)
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
        const { presentationCode, groupId } = event.params
        const user = event.user

        if (groupId && user?._id) {
            const group = await groupService.getGroup(groupId)
            if (!group) {
                throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
            }
            const role = await groupService.roleOf(user, groupId)
            const userRole = new RoleImpl(user, role)
            if (!userRole.hasPermission(Privilege.VIEWING)) {
                throw PRESENTATION_ERROR_CODE.NOT_HAVING_PERMISSION
            }
        }
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
        // presentTo: groupId,
        // access: Access
        const { presentationId, slideId, isPresenting, access, presentTo } = event.body
        const presentation = await presentationService.getById(presentationId)
        if (!presentation) {
            throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
        }
        const slideMatch = presentation.slideList.find((slide) => slide._id.toString() === slideId)
        if (!slideMatch) {
            throw PRESENTATION_ERROR_CODE.SLIDE_NOT_FOUND
        }
        const user = event.user
        if (!isPresenting) {
            // stop presenting
            await groupService.stopPresentingForGroups(presentationId)
        } else {
            // start presenting
            if (access && access === Access.ONLY_GROUP) {
                if (!presentTo) throw PRESENTATION_ERROR_CODE.MISSING_PRESENT_TO
                const groupId = presentTo
                const group = await groupService.getGroup(groupId)
                if (!group) {
                    throw GROUP_ERROR_CODE.GROUP_NOT_FOUND
                }
                const role = await groupService.roleOf(user, groupId)
                const userRole = new RoleImpl(user, role)
                if (!userRole.hasPermission(Privilege.PRESENTING)) {
                    throw PRESENTATION_ERROR_CODE.NOT_HAVING_PERMISSION
                }
                await groupService.startPresenting(groupId, presentationId)
                socketService.broadcastToRoom(groupId, PresentationEvent.NEW_PRESENTING_IN_GROUP)
            }
        }
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

    getCollaborators: controllerWrapper(async (event: IEvent) => {
        const { presentationId } = event.params
        const { skip, limit } = event.query
        const collaborators = await presentationService.getCollaborators(presentationId, {
            skip,
            limit,
        })
        return collaborators.map((collaborator) => userMapper(collaborator))
    }),

    removeCollaborator: controllerWrapper(async (event: IEvent) => {
        const { presentationId, collaboratorId } = event.params
        const userId = event.user._id.toString()
        const collaborators = await presentationService.removeCollaborator(
            userId,
            presentationId,
            collaboratorId,
        )
        return collaborators.map((collaborator) => userMapper(collaborator))
    }),

    getCollaboratedPresentations: controllerWrapper(async (event: IEvent) => {
        const userId = event.user._id.toString()
        const presentations = await presentationService.getCollaboratedPresentations(userId)
        return presentations.map((presentation) => mapToPresentationResponse(presentation))
    }),

    getParticipatedPresentations: controllerWrapper(async (event: IEvent) => {
        const userId = event.user._id.toString()
        const presentations = await presentationService.getParticipatedPresentations(userId)
        return presentations.map((presentation) => mapToPresentationResponse(presentation))
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
        return mapToQnAQuestionResponse(questions)
    }),

    getQnaQuestionList: controllerWrapper(async (event: IEvent) => {
        const { presentationCode } = event.params
        const { page, pageSize } = event.query
        const questions = await presentationService.getQnAQuesionList(presentationCode, {
            page,
            pageSize,
        })
        return mapToQnAQuestionResponse(questions)
    }),

    updateQnAQuestion: controllerWrapper(async (event: IEvent) => {
        const { presentationCode } = event.params
        const qnaQuestion = event.body
        if (qnaQuestion.id) {
            qnaQuestion._id = qnaQuestion.id
            delete qnaQuestion.id
        }
        const questions = await presentationService.updateQnAQuestion(presentationCode, qnaQuestion)
        return mapToQnAQuestionResponse(questions)
    }),

    updateGroupAnswer: controllerWrapper(async (event: IEvent) => {
        const { presentationCode, optionId, groupId } = event.body
        const { _id } = event.user
        const modifiedPresentation = await presentationService.updateGroupAnswer(
            presentationCode,
            optionId,
            groupId,
            _id,
        )
        if (!modifiedPresentation) return { ok: false }
        else return { ok: true }
    }),

    getUserAnswers: controllerWrapper(async (event: IEvent) => {
        const { slideId, optionId } = event.params
        const { skip, limit } = event.query
        const { _id } = event.user
        const answerInfos = await presentationService.getUserAnswer(slideId, optionId, _id, {
            skip,
            limit,
        })
        return mapToAnswerInfoResponse(answerInfos)
    }),
}
