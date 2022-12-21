import { Types } from 'mongoose'
import { SlideType } from '../../enums'
import {
    PresentationResponse,
    SlideResponse,
    Option,
    Presentation,
    Slide,
    OptionResponse,
    IMultipleChoiceSlide,
    IMultipleChoiceSlideResponse,
    IHeadingSlide,
    IHeadingSlideResponse,
    IParagraphSlide,
    IParagraphSlideResponse,
} from '../../interfaces/presentation/presentation.interface'
import { mapTo as userMapper } from '../user/mapper'
const mapToSlideListResponse = (slideList: Slide[]): SlideResponse[] => {
    return slideList.map(mapToSlideResponse)
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
        slideList: [],
        inviteCode: presentation.inviteCode,
    }
}
const mapToSlideResponse = (slide: Slide): SlideResponse => {
    let response: SlideResponse = {
        id: slide._id,
        type: slide.type,
    }
    switch (slide.type) {
        case SlideType.MULTIPLE_CHOICE:
            const multipleChoiceSlide: IMultipleChoiceSlide = slide as IMultipleChoiceSlide
            const optionList = multipleChoiceSlide?.optionList?.map((option) =>
                mapToOptionResponse(option),
            )
            response = {
                ...response,
                text: multipleChoiceSlide.text,
                optionList: optionList,
            } as IMultipleChoiceSlideResponse
            break
        case SlideType.HEADING:
            const headingSlide: IHeadingSlide = slide as IHeadingSlide
            response = {
                ...response,
                heading: headingSlide.heading,
                subHeading: headingSlide.subHeading,
            } as IHeadingSlideResponse
            break
        case SlideType.PARAGRAPH:
            const paragraphSlide: IParagraphSlide = slide as IParagraphSlide
            response = {
                ...response,
                heading: paragraphSlide.heading,
                paragraph: paragraphSlide.paragraph,
            } as IParagraphSlideResponse
            break
        default:
            break
    }
    return response
}
const mapToOptionResponse = (option: Option): OptionResponse => {
    return {
        id: option._id,
        answer: option.answer,
        votes: option.votes,
    }
}
// map to list of presentation response
const mapToPresentationListResponse = (
    presentationList: Presentation[],
): PresentationResponse[] => {
    return presentationList.map(mapToPresentationResponse)
}

export { mapToPresentationResponse, mapToSlideResponse, mapToSlideListResponse }
