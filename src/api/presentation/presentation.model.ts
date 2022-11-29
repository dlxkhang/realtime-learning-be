import mongoose from 'mongoose'
import { Option, Presentation, Slide } from '../../interfaces/presentation/presentation.interface'
const { Schema } = mongoose
const Option = new Schema<Option>({
    answer: { type: String, required: true },
    vote: { type: Number },
})

const Slide = new Schema<Slide>({
    text: { type: String },
    optionList: [{ type: Option }],
})
const Presentation = new Schema<Presentation>({
    name: { type: String },
    description: { type: String },
    createBy: { type: String },
    isPresenting: { type: Boolean },
    currentSlide: { type: Number },
    inviteCode: { type: String },
    slideList: [{ type: Slide }],
})

export default mongoose.model('Presentations', Presentation)
