import { Types } from 'mongoose'
import {
    PresentationResponse,
    SlideResponse,
    Option,
    Presentation,
    Slide,
    OptionResponse,
} from '../../interfaces/presentation/presentation.interface'
import { mapTo as userMapper } from '../user/mapper'
const mapToSlideListResponse = (presentation: Presentation): SlideResponse[] => {
    const slideList = presentation.slideList.map(mapToSlideResponse)
    return slideList
}
const mapToPresentationResponse = (presentation: Presentation): PresentationResponse => {
    let transformedCreateBy
    if (!(presentation.createBy instanceof Types.ObjectId)) {
        transformedCreateBy = userMapper(presentation.createBy as any)
    }

    return {
        id: presentation._id,
        name: presentation.name,
        description: presentation.description,
        createBy: transformedCreateBy,
        isPresenting: presentation.isPresenting,
        currentSlide: presentation.currentSlide,
        slideList: mapToSlideListResponse(presentation),
        inviteCode: presentation.inviteCode,
    }
}
const mapToSlideResponse = (slide: Slide): SlideResponse => {
    const optionListResponse = slide.optionList.map(mapToOptionResponse)
    return {
        id: slide._id,
        text: slide.text,
        optionList: optionListResponse,
    }
}
const mapToOptionResponse = (option: Option): OptionResponse => {
    return {
        id: option._id,
        answer: option.answer,
        vote: option.vote,
    }
}
export { mapToPresentationResponse, mapToSlideResponse, mapToSlideListResponse }
