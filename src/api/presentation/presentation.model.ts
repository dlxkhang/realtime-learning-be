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
})

export default mongoose.model('Presentations', Presentation)
