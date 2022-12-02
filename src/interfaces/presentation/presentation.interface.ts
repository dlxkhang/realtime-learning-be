import { Types } from 'mongoose'
import { IUser } from '../user'
interface Option {
    _id: string
    answer: string
    vote: number
}
interface Slide {
    _id: string
    text: string
    optionList: Option[]
}

interface Presentation {
    _id?: string
    name?: string
    description?: string
    createBy: Types.ObjectId | IUser | string
    isPresenting: boolean
    currentSlide: number
    inviteCode: string
    slideList?: Slide[]
}

interface PresentationResponse {
    id: string
    name?: string
    description?: string
    createBy: string | IUser
    isPresenting: boolean
    currentSlide: number
    inviteCode: string
    slideList?: SlideResponse[]
}

interface SlideResponse {
    id: string
    text?: string
    optionList?: OptionResponse[]
}

interface OptionResponse {
    id: string
    answer: string
    vote: Number
}

export { Option, Slide, Presentation, PresentationResponse, SlideResponse, OptionResponse }
