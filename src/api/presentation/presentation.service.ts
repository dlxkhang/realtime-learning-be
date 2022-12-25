import { SlideType } from '../../enums'
import { PRESENTATION_ERROR_CODE } from '../../common/error-code'
import {
    IHeadingSlide,
    IMultipleChoiceSlide,
    IParagraphSlide,
    Option,
    Presentation,
    Slide,
} from '../../interfaces/presentation/presentation.interface'
import presentationRepository from './presentation.repository'
import { Error, PipelineStage } from 'mongoose'
import * as crypto from 'crypto-js'
import userModel from '../user/model/user.model'
import socketService from '../socket/socket.service'
import { ChatEvent, PresentationEvent } from '../socket/event'
import { IMessage } from '../../interfaces/message/message.interface'
import { IUser } from '../../interfaces'

class PresentationService {
    private repository: typeof presentationRepository
    constructor() {
        this.repository = presentationRepository
    }

    async create(newPresentation: Presentation): Promise<Presentation> {
        const { name, description, createBy } = newPresentation
        if (!name) {
            throw PRESENTATION_ERROR_CODE.MISSING_PRESENTATION_NAME
        }
        const createUser = userModel.findById(createBy)
        if (!createUser) {
            throw PRESENTATION_ERROR_CODE.USER_NOT_FOUND
        }
        const randomInviteCode = Math.floor(1000000 + Math.random() * 9000000).toString()
        const presentation: Presentation = {
            name,
            description,
            createBy,
            inviteCode: randomInviteCode,
            isPresenting: false,
            currentSlide: 0,
            slideList: [],
        }
        return await this.repository.create(presentation)
    }
    async getById(presentationId?: string): Promise<Presentation> {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const presentation = await this.repository.getPresentationById(presentationId)
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }
            return presentation
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }
    async editById(presentationId: string, presentation: Presentation): Promise<Presentation> {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const modifiedPresentation = await this.repository.editById(
                presentationId,
                presentation,
            )
            if (!modifiedPresentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }
            return modifiedPresentation
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async deleteById(presentationId: string): Promise<Presentation> {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const deletedPresentation = await this.repository.deleteById(presentationId)
            if (!deletedPresentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            return deletedPresentation
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async addSlide(presentationId: string, newSlide: Slide) {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const presentation = await this.repository.getPresentationById(presentationId)
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }
            if (!presentation.slideList) {
                presentation.slideList = []
            }
            presentation.slideList = presentation.slideList.concat(newSlide)
            const modifiedPresentation = await this.repository.editById(
                presentationId,
                presentation,
            )
            return modifiedPresentation
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }
    async deleteSlide(presentationId: string, slideId: string) {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const presentation = await this.repository.getPresentationById(presentationId)
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }
            if (!presentation.slideList) {
                presentation.slideList = []
            }
            presentation.slideList = presentation.slideList.filter(
                (slide) => slide._id.toString() !== slideId,
            )
            const modifiedPresentation = await this.repository.editById(
                presentationId,
                presentation,
            )
            return modifiedPresentation
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async editSlide(
        presentationId: string,
        slideId: string,
        newSlideInfo: Slide,
    ): Promise<Presentation> {
        try {
            const presentation: Presentation = await this.repository.getPresentationById(
                presentationId,
            )
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            const modifiedSlideIdx = presentation.slideList.findIndex(
                (x) => x._id.toString() === slideId,
            )
            if (modifiedSlideIdx === -1) {
                throw PRESENTATION_ERROR_CODE.SLIDE_NOT_FOUND
            }
            const newSlide: Slide = {
                _id: slideId,
                ...newSlideInfo,
            }

            presentation.slideList[modifiedSlideIdx] = newSlide

            const modifiedPresentation = await this.repository.editById(
                presentationId,
                presentation,
            )
            return modifiedPresentation
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async updateAnswer(presentationCode: any, optionId: any) {
        const presentation = await this.repository.getPresentationByCode(presentationCode)
        if (!presentation) {
            throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
        }
        const slide = presentation.slideList[presentation.currentSlide]
        if (!slide) {
            throw PRESENTATION_ERROR_CODE.SLIDE_NOT_FOUND
        }
        if (slide.type != SlideType.MULTIPLE_CHOICE) {
            throw PRESENTATION_ERROR_CODE.INVALID_SLIDE_TYPE
        }
        const multipleChoiceSlide = slide as IMultipleChoiceSlide
        const option: Option = multipleChoiceSlide.optionList.find(
            (option) => option._id.toString() === optionId,
        )
        if (!option) {
            throw PRESENTATION_ERROR_CODE.OPTION_NOT_FOUND
        }
        option.votes += 1
        const modifiedPresentation = await this.repository.editById(presentation._id, presentation)

        // Broadcast the results to all users watching the slide
        socketService.broadcastToRoom(presentationCode, PresentationEvent.UPDATE_RESULTS, {
            slide,
        })
        return modifiedPresentation
    }

    async getPresentingSlide(presentationCode: string): Promise<Slide> {
        try {
            console.log(presentationCode)
            const presentation = await this.repository.getPresentationByCode(presentationCode)
            console.log(presentation)
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            if (!presentation.isPresenting) {
                throw PRESENTATION_ERROR_CODE.SLIDE_NOT_PRESENTING
            }
            return presentation.slideList[presentation.currentSlide]
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }
    // get presentation list by userId
    async getPresentationListByUserId(userId: string): Promise<Presentation[]> {
        try {
            if (!userId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const presentationList = await this.repository.getPresentationListByUserId(userId)
            if (!presentationList) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }
            return presentationList
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async updatePresentStatus(
        presentationId: string,
        slideId: string,
        isPresenting: boolean,
    ): Promise<Slide> {
        try {
            const presentation = await this.repository.getPresentationById(presentationId)
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            const slideIndex: number = presentation.slideList.findIndex(
                (slide) => slide._id.toString() === slideId,
            )
            if (slideIndex === -1) {
                throw PRESENTATION_ERROR_CODE.SLIDE_NOT_FOUND
            }

            const updatePresentation = await this.repository.updatePresentingStatus(
                presentationId,
                slideIndex,
                isPresenting,
            )

            if (!updatePresentation.isPresenting) {
                console.log('Emit end presenting', updatePresentation.inviteCode)
                // Announce client that the presentation has stopped
                socketService.broadcastToRoom(
                    updatePresentation.inviteCode,
                    PresentationEvent.END_PRESENTING,
                )
            }
            return updatePresentation.slideList[updatePresentation.currentSlide]
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async addMessage(presentationCode: string, newMessage: IMessage): Promise<IMessage[]> {
        try {
            const presentation = await this.repository.getPresentationByCode(presentationCode)
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            const updatePresentation = await this.repository.findOneAndUpdate(
                { inviteCode: presentationCode },
                {
                    $push: { messages: newMessage },
                },
            )

            if (updatePresentation) {
                // Announce to clients
                socketService.broadcastToRoom(
                    updatePresentation.inviteCode,
                    ChatEvent.NEW_CHAT_MESSAGE,
                    newMessage,
                )
            }
            return updatePresentation.messages
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async getMessages(
        presentationCode: string,
        options: { page?: string; pageSize?: string; sort?: any } = {},
    ): Promise<IMessage[]> {
        try {
            const { page, pageSize } = options
            const skipPipe: PipelineStage = page &&
                pageSize && {
                    $skip: (parseInt(page) - 1) * parseInt(pageSize),
                }
            const limitPipe: PipelineStage = pageSize && {
                $limit: parseInt(pageSize),
            }
            const pipeline: PipelineStage[] = [
                {
                    $match: {
                        inviteCode: presentationCode,
                    },
                },
                {
                    $unwind: '$messages',
                },
                {
                    $project: {
                        message: '$messages',
                    },
                },
                {
                    $sort: {
                        'message.date': -1,
                    },
                },
            ]
            if (skipPipe) {
                pipeline.push(skipPipe)
            }
            if (limitPipe) {
                pipeline.push(limitPipe)
            }
            pipeline.push({
                $group: {
                    _id: '_id',
                    messages: {
                        $push: '$message',
                    },
                },
            })

            const presentations = await this.repository.aggregate(pipeline)

            const messages = presentations?.[0]?.messages ?? []
            return messages
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async getCollaborators(
        presentationId: string,

        options: { limit?: number; skip?: number } = {},
    ): Promise<IUser[]> {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const parsedLimit = parseInt(options.limit.toString())
            const parsedSkip = parseInt(options.skip.toString())

            const presentation = await this.repository.findById(
                presentationId,
                {},
                {
                    populate: [
                        {
                            path: 'collaborators',
                            select: 'fullName avatar email',
                            options: {
                                skip: parsedSkip,
                                limit: parsedLimit,
                            },
                        },
                    ],
                },
            )
            console.log({
                limit: parsedLimit,
                skip: parsedSkip,
            })
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            if (!presentation.collaborators) return []
            const owner: IUser = presentation.createBy as IUser
            return [owner, ...presentation.collaborators]
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async addCollaborator(presentationId: string, collaboratorId: string): Promise<Presentation> {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const presentation = await this.repository.findById(
                presentationId,
                {},
                {
                    populate: [
                        {
                            path: 'collaborators',
                        },
                    ],
                },
            )
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }
            if (
                presentation.collaborators &&
                presentation.collaborators.find((item) => item._id === collaboratorId)
            )
                throw PRESENTATION_ERROR_CODE.DUPLICATE_COLLABORATOR

            return await this.repository.findOneAndUpdate(
                {
                    _id: presentationId,
                },
                {
                    $push: {
                        collaborators: collaboratorId,
                    },
                },
            )
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async removeCollaborator(
        userId: string,
        presentationId: string,
        collaboratorId: string,
    ): Promise<IUser[]> {
        try {
            if (!presentationId) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_MISSING_ID
            }
            const presentation = await this.repository.findById(
                presentationId,
                {},
                {
                    populate: [
                        {
                            path: 'collaborators',
                        },
                    ],
                },
            )
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }
            const owner: IUser = presentation.createBy as IUser
            if (userId !== owner._id.toString()) throw PRESENTATION_ERROR_CODE.INVALID_OWNER
            if (
                presentation.collaborators &&
                !presentation.collaborators.find((item) => item._id.toString() === collaboratorId)
            )
                throw PRESENTATION_ERROR_CODE.COLLABORATOR_NOT_FOUND

            const updatedPresentation = await this.repository.findOneAndUpdate(
                {
                    _id: presentationId,
                },
                {
                    $pull: {
                        collaborators: collaboratorId,
                    },
                },
            )
            return updatedPresentation.collaborators
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }

    async getCollaboratedPresentations(userId: string): Promise<IUser[]> {
        try {
            const presentation = await this.repository.findOne(
                {
                    collaborators: userId,
                },
                {},
                {
                    populate: [
                        {
                            path: 'collaborators',
                            select: 'fullName avatar email',
                        },
                    ],
                },
            )
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            return presentation.collaborators
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }
}

export default new PresentationService()
