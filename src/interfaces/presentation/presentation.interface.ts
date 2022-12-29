import { Types } from 'mongoose'
import { SlideType } from '../../enums'
import { IMessage } from '../message/message.interface'
import { IUser } from '../user'
interface Option {
    _id: string
    answer: string
    votes: number
}
interface Slide {
    _id?: string
    type: SlideType
}
interface IMultipleChoiceSlide extends Slide {
    text: string
    optionList: Option[]
}
interface IHeadingSlide extends Slide {
    heading: string
    subHeading: string
}

interface IParagraphSlide extends Slide {
    heading: string
    paragraph: string
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
    collaborators?: IUser[]
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
    collaborators?: IUser[]
}

interface SlideResponse {
    id: string
    type: string
}
interface IMultipleChoiceSlideResponse extends SlideResponse {
    text: string
    optionList: OptionResponse[]
}
interface IHeadingSlideResponse extends SlideResponse {
    heading: string
    subHeading: string
}

interface IParagraphSlideResponse extends SlideResponse {
    heading: string
    paragraph: string
}

interface OptionResponse {
    id: string
    answer: string
    votes: Number
}

interface QnAQuestion {
    _id?: string
    question: string
    likeCount: number
    isAnswered: boolean
    date: Date
}
interface QnAQuestionResponse {
    id: string
    question: string
    likeCount: number
    isAnswered: boolean
    date: Date
}
export {
    Option,
    Slide,
    Presentation,
    IHeadingSlide,
    IParagraphSlide,
    IMultipleChoiceSlide,
    IMultipleChoiceSlideResponse,
    IHeadingSlideResponse,
    IParagraphSlideResponse,
    PresentationResponse,
    SlideResponse,
    OptionResponse,
    QnAQuestionResponse,
    QnAQuestion,
}
