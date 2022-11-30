import { PRESENTATION_ERROR_CODE } from '../../common/error-code'
import { Presentation } from '../../interfaces/presentation/presentation.interface'
import presentationRepository from './presentation.repository'
import * as crypto from 'crypto-js'

class PresentationService {
    private repository: typeof presentationRepository
    constructor() {
        this.repository = presentationRepository
    }

    async create(newPresentation: Presentation): Promise<Presentation> {
        const { name, description, createBy } = newPresentation
        if (!name) {
            throw PRESENTATION_ERROR_CODE.MISSING_GROUP_NAME
        }
        const randomInviteCode = crypto.lib.WordArray.random(6).toString()
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
}

export default new PresentationService()
