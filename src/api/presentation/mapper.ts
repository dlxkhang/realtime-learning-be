import {
    PresentationResponse,
    Presentation,
} from '../../interfaces/presentation/presentation.interface'
const mapToResponse = (presentation: Presentation): PresentationResponse => {
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
export { mapToResponse }
