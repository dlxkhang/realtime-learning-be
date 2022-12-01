import {
    PresentationResponse,
    SlideResponse,
    Option,
    Presentation,
    Slide,
    OptionResponse,
} from '../../interfaces/presentation/presentation.interface'
const mapToSlideListResponse = (presentation: Presentation): SlideResponse[] => {
    const slideList = presentation.slideList.map(mapToSlideResponse)
    return slideList
}
const mapToPresentationResponse = (presentation: Presentation): PresentationResponse => {
    return {
        id: presentation._id,
        name: presentation.name,
        description: presentation.description,
        createBy: presentation.createBy,
        isPresenting: presentation.isPresenting,
        currentSlide: presentation.currentSlide,
        slideList: presentation.slideList,
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
