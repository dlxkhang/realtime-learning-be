import {
    FilterQuery,
    QueryOptions,
    UpdateQuery,
    PipelineStage,
    AggregateOptions,
    ProjectionType,
} from 'mongoose'
import { PRESENTATION_ERROR_CODE } from '../../common/error-code'
import { Presentation, Slide } from '../../interfaces/presentation/presentation.interface'
import presentationModel from './presentation.model'

class PresentationRepository {
    async create(newPresenation: Presentation) {
        return (
            await (
                await presentationModel.create(newPresenation)
            ).populate({
                path: 'createBy',
                select: 'fullName avatar',
            })
        ).toObject()
    }

    async editById(
        presentationId: string,
        EditedPresentation: Presentation,
    ): Promise<Presentation> {
        return presentationModel
            .findByIdAndUpdate(presentationId, EditedPresentation, {
                new: true,
            })
            .populate({
                path: 'createBy',
                select: 'fullName avatar',
            })
            .lean()
    }

    async getPresentationById(presentationId: string): Promise<Presentation> {
        return presentationModel.findById(
            presentationId,
            {},
            {
                populate: [
                    {
                        path: 'createBy',
                        select: 'fullName avatar email',
                    },
                ],
                lean: true,
            },
        )
    }

    async getPresentationByCode(code: string): Promise<Presentation> {
        return presentationModel.findOne(
            { inviteCode: code },
            {},
            {
                populate: [
                    {
                        path: 'createBy',
                        select: 'fullName avatar',
                    },
                ],
                lean: true,
            },
        )
    }

    async deleteById(presentationId: string): Promise<Presentation> {
        return presentationModel
            .findByIdAndDelete(presentationId)
            .populate({
                path: 'createBy',
                select: 'fullName avatar',
            })
            .lean()
    }

    //get list of presentation by user id
    async getPresentationListByUserId(userId: string): Promise<Presentation[]> {
        return presentationModel.find(
            {
                createBy: userId,
            },
            {},
            {
                populate: [
                    {
                        path: 'createBy',
                        select: 'fullName avatar',
                    },
                ],
                lean: true,
            },
        )
    }

    async updatePresentingStatus(
        presentationId: string,
        currentSlide: number,
        isPresenting: boolean,
    ): Promise<Presentation> {
        return presentationModel
            .findByIdAndUpdate(
                presentationId,
                {
                    isPresenting,
                    currentSlide,
                },
                {
                    new: true,
                },
            )
            .populate({
                path: 'createBy',
                select: 'fullName avatar',
            })
            .lean()
    }

    async findOneAndUpdate(
        filter: FilterQuery<any>,
        update: UpdateQuery<any>,
        options?: QueryOptions<any>,
    ): Promise<Presentation> {
        return presentationModel.findOneAndUpdate(filter, update, {
            new: true,
            lean: true,
            populate: [
                {
                    path: 'createBy',
                    select: 'fullName avatar',
                },
            ],
            ...options,
        })
    }

    async aggregate(
        pipeline: PipelineStage[],
        options: AggregateOptions = {},
    ): Promise<Presentation[]> {
        return presentationModel.aggregate(pipeline, options)
    }

    async findById(
        id: any,
        projection?: ProjectionType<any>,
        options?: QueryOptions<Presentation>,
    ): Promise<Presentation> {
        const { populate, ...otherOptions } = options
        return await presentationModel.findById(id, projection, {
            new: true,
            lean: true,
            ...otherOptions,
            populate: [
                {
                    path: 'createBy',
                    select: 'fullName avatar email',
                },
                ...(populate as any),
            ],
        })
    }

    async findOne(
        filter: FilterQuery<Presentation>,
        projection?: ProjectionType<any>,
        options?: QueryOptions<any>,
    ): Promise<Presentation> {
        const { populate, ...otherOptions } = options
        return await presentationModel.findOne(filter, projection, {
            new: true,
            lean: true,
            populate: [
                {
                    path: 'createBy',
                    select: 'fullName avatar email',
                },
                ...(populate as any),
            ],
            ...otherOptions,
        })
    }

    async find(
        filter: FilterQuery<Presentation>,
        projection?: ProjectionType<any>,
        options?: QueryOptions<any>,
    ): Promise<Presentation[]> {
        const { populate, ...otherOptions } = options
        return await presentationModel.find(filter, projection, {
            new: true,
            lean: true,
            populate: [
                {
                    path: 'createBy',
                    select: 'fullName avatar email',
                },
                ...(populate as any),
            ],
            ...otherOptions,
        })
    }
}

export default new PresentationRepository()
