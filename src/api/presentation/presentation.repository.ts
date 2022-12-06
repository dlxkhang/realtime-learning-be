import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
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
        return await presentationModel
            .findByIdAndUpdate(presentationId, EditedPresentation, {
                new: true,
            })
            .populate({
                path: 'createBy',
                select: 'fullName avatar',
            })
            .lean()
    }

    async getPrentationById(presentationId: string): Promise<Presentation> {
        return await presentationModel.findById(
            presentationId,
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

    async getPrentationByCode(code: string): Promise<Presentation> {
        return await presentationModel.findOne(
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
        return await presentationModel
            .findByIdAndDelete(presentationId)
            .populate({
                path: 'createBy',
                select: 'fullName avatar',
            })
            .lean()
    }

    //get list of presentation by user id
    async getPresentationListByUserId(userId: string): Promise<Presentation[]> {
        return await presentationModel.find(
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
        return await presentationModel
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
        return await presentationModel.findOneAndUpdate(filter, update, {
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
}

export default new PresentationRepository()
