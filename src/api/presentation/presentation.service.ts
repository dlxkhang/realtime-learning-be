import { PRESENTATION_ERROR_CODE } from '../../common/error-code'
import { Option, Presentation, Slide } from '../../interfaces/presentation/presentation.interface'
import presentationRepository from './presentation.repository'
import { Error } from 'mongoose'
import * as crypto from 'crypto-js'
import userModel from '../user/model/user.model'
import socketService from '../socket/socket.service'
import { ChatEvent, PresentationEvent } from '../socket/event'
import { IMessage } from '../../interfaces/message/message.interface'

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
            const presentation = await this.repository.getPrentationById(presentationId)
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
            const presentation = await this.repository.getPrentationById(presentationId)
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
            const presentation = await this.repository.getPrentationById(presentationId)
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
            const presentation: Presentation = await this.repository.getPrentationById(
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
        const presentation = await this.repository.getPrentationByCode(presentationCode)
        if (!presentation) {
            throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
        }
        const slide = presentation.slideList[presentation.currentSlide]
        if (!slide) {
            throw PRESENTATION_ERROR_CODE.SLIDE_NOT_FOUND
        }

        const option: Option = slide.optionList.find((option) => option._id.toString() === optionId)
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
            const presentation = await this.repository.getPrentationByCode(presentationCode)

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
            const presentation = await this.repository.getPrentationById(presentationId)
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
            const presentation = await this.repository.getPrentationByCode(presentationCode)
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

    async getMessages(presentationCode: string): Promise<IMessage[]> {
        try {
            const presentation = await this.repository.getPrentationByCode(presentationCode)
            if (!presentation) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_NOT_FOUND
            }

            return presentation.messages
        } catch (e) {
            if (e instanceof Error.CastError) {
                throw PRESENTATION_ERROR_CODE.PRESENTATION_INVALID_ID
            } else throw e
        }
    }
}

export default new PresentationService()
