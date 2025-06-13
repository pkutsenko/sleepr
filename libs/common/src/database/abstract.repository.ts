import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    constructor(protected readonly model: Model<TDocument>) {}

    protected abstract readonly logger: Logger;

    async create(doc: Omit<TDocument, '_id'>): Promise<TDocument> {

            const createdDoc = new this.model({
                ...doc,
                _id: new Types.ObjectId(),
            });

            return (await createdDoc.save()).toJSON() as TDocument;
    }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument | null> {
        const document = await this.model.findOne(filterQuery).lean<TDocument>(true);

        if (!document) {
            this.logger.error(`Document not found for filter query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found for filter query: ${JSON.stringify(filterQuery)}`);
        }

        return document;
    }

    async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument | null> {
        const document = await this.model.findOneAndUpdate(filterQuery, update, { new: true }).lean<TDocument>(true);

        if (!document) {
            this.logger.error(`Document not found for filter query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found for filter query: ${JSON.stringify(filterQuery)}`);
        }

        return document;
    }

    async find(filterQuery: FilterQuery<TDocument> = {}): Promise<TDocument[]> {
        return this.model.find(filterQuery).lean<TDocument[]>(true);
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument | null> {
        const document = await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);

        if (!document) {
            this.logger.error(`Document not found for filter query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found for filter query: ${JSON.stringify(filterQuery)}`);
        }

        return document;
    }
}