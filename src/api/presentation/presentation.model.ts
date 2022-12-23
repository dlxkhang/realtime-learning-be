import mongoose from 'mongoose'
import { Option, Presentation, Slide } from '../../interfaces/presentation/presentation.interface'

import userModel from '../user/model/user.model'
const { Schema } = mongoose
const Option = new Schema<Option>({
    answer: { type: String, required: true },
    votes: { type: Number },
})

const Slide = new Schema<Slide>({
    text: { type: String },
    optionList: [{ type: Option }],
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
    qnaQuestionList: [{ type: QnAQuestion }],
})

export default mongoose.model('Presentations', Presentation)
