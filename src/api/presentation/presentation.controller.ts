import { RoleImpl } from '../../implementation'
import controllerWrapper from '../../core/controllerWrapper'
import { Access, Privilege, SlideType } from '../../enums'
import { IEvent } from '../../interfaces'
import { IMessage } from '../../interfaces/message/message.interface'
import {
    IHeadingSlide,
    IMultipleChoiceSlide,
    IParagraphSlide,
    Presentation,
    Slide,
} from '../../interfaces/presentation/presentation.interface'
import groupService from '../group/group.service'
import { GROUP_ERROR_CODE, PRESENTATION_ERROR_CODE } from './../../common/error-code'
import { mapToPresentationResponse, mapToSlideListResponse, mapToSlideResponse } from './mapper'
import presentationService from './presentation.service'

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
        console.log('event', event.params)
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
        const { presentationId, slideId, isPresenting, access, presentTo } = event.body
        const user = event.user
        if (!isPresenting) {
            // stop presenting
            await groupService.stopPresentingForGroups(presentationId)
        } else {
            // start presenting
            if (access === Access.ONLY_GROUP) {
                console.log('Start presenting', access, presentTo)
                const groupIds: string[] = presentTo
                for (let i = 0; i < groupIds.length; i++) {
                    const groupId = groupIds[i]
                    console.log('user', user)
                    const role = await groupService.roleOf(user, groupId)
                    console.log('role', role)
                    const userRole = new RoleImpl(user, role)
                    if (!userRole.hasPermission(Privilege.PRESENTING)) {
                        throw GROUP_ERROR_CODE.NOT_HAVING_PERMISSION
                    }
                    console.log('Has permission')
                    await groupService.startPresenting(groupId, presentationId)
                }
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
}
