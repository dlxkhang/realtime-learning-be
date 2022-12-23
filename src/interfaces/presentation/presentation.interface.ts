import { Types } from 'mongoose'
import { IMessage } from '../message/message.interface'
import { IUser } from '../user'
interface Option {
    _id: string
    answer: string
    votes: number
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
    messages?: IMessage[]
    qnaQuestionList?: QnAQuestion[]
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
    votes: Number
}

interface QnAQuestion {
    id?: string
    question: string
    likeCount: number
    isAnswered: boolean
    date: Date
}
export {
    Option,
    Slide,
    Presentation,
    PresentationResponse,
    SlideResponse,
    OptionResponse,
    QnAQuestion,
}
