import mongoose from 'mongoose'
import { Presentation, Slide } from '../../interfaces/presentation/presentation.interface'

const { Schema } = mongoose
// const Option = new Schema<Option>({
//     answer: { type: String, required: true },
//     votes: { type: Number },
// })

// const MultipleChoiceSlide = new Schema<IMultipleChoiceSlide>({
//     text: { type: String },
//     optionList: [{ type: Option }],
// })
const Slide = new Schema<Slide>({
    type: { type: String },
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
})

export default mongoose.model('Presentations', Presentation)
