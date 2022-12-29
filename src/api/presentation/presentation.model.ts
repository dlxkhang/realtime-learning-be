import mongoose from 'mongoose'
import {
    IHeadingSlide,
    IMultipleChoiceSlide,
    IParagraphSlide,
    Presentation,
    Slide,
} from '../../interfaces'

const { Schema } = mongoose
const Slide = new Schema<IHeadingSlide | IMultipleChoiceSlide | IParagraphSlide>({
    type: { type: String },
    text: { type: String },
    optionList: [{ type: Schema.Types.Mixed }],
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
