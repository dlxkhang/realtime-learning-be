import mongoose from 'mongoose'
import {
    IHeadingSlide,
    IMultipleChoiceSlide,
    IParagraphSlide,
    Presentation,
    Slide,
    Option,
    AnswerInfo,
} from '../../interfaces'
const { Schema } = mongoose

const AnswerInfo = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        answeredAt: { type: Date },
    },
    { _id: false },
)

const Option = new Schema<Option>({
    answer: { type: String, required: true },
    votes: { type: Number },
    answerInfos: [{ type: AnswerInfo }],
})

const Slide = new Schema<IHeadingSlide | IMultipleChoiceSlide | IParagraphSlide>({
    type: { type: String },
    text: { type: String },
    optionList: [{ type: Option }],
    heading: { type: String },
    subHeading: { type: String },
    paragraph: { type: String },
})
const QnAQuestion = new Schema({
    question: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    isAnswered: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
})

const Presentation = new Schema<Presentation>({
    name: { type: String },
    description: { type: String },
    createBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isPresenting: { type: Boolean },
    currentSlide: { type: Number },
    inviteCode: { type: String },
    slideList: [{ type: Slide }],
    messages: [{ type: Schema.Types.Mixed }],
    collaborators: [{ type: Schema.Types.ObjectId, default: [], ref: 'User' }],
    qnaQuestionList: [{ type: QnAQuestion }],
})

export default mongoose.model('Presentations', Presentation)
