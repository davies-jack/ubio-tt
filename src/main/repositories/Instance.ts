import { config } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { GroupSchema, InstanceSchema } from '../schemas/InstanceSchema.js';

export class InstanceRepository {

    @dep() private mongodb!: MongoDb;
    @config({
        default: 7200,
    })
    private EXPIRY_TIME_IN_SECONDS!: number;

    protected get collection() {
        return this.mongodb.db.collection('instances');
    }

    async AutoDeleteIndex() {
        await this.collection.createIndex(
            {
                updatedAt: 1,
            },
            {
                expireAfterSeconds: this.EXPIRY_TIME_IN_SECONDS,
            },
        );
    }

    async getAllGroups(): Promise<GroupSchema[] | null> {
        const groups = await this.collection
            .aggregate([
                {
                    $group: {
                        _id: '$group',
                        instances: { $sum: 1 },
                        createdAt: { $min: '$createdAt' },
                        updatedAt: { $max: '$updatedAt' },
                    },
                },
                {
                    $match: {
                        instances: { $gt: 0 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        group: '$_id',
                        instances: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
                {
                    $sort: {
                        group: 1,
                    },
                },
            ])
            .toArray();

        if (groups.length === 0) {
            return null;
        }

        return groups.map(group => ({
            id: group.id,
            group: group.group,
            instances: group.instances,
            createdAt: group.createdAt.getTime(),
            updatedAt: group.updatedAt.getTime(),
        }));
    }

    async registerInstance(group: string, id: string, meta?: any): Promise<InstanceSchema | null> {
        const currentDate = new Date();
        const instance = await this.collection.findOneAndUpdate(
            {
                group,
                id,
            },
            {
                $set: {
                    updatedAt: currentDate,
                    meta,
                },
                $setOnInsert: {
                    id,
                    group,
                    createdAt: currentDate,
                },
            },
            {
                upsert: true,
                returnDocument: 'after',
                projection: {
                    _id: false,
                },
            },
        );

        if (!instance) {
            console.error(instance);
            return null;
        }

        return {
            id: instance.id,
            group: instance.group,
            createdAt: instance.createdAt.getTime(),
            updatedAt: instance.updatedAt.getTime(),
            meta: instance.meta,
        };
    }

    async deleteInstance(group: string, id: string): Promise<boolean> {
        const deletedDocument = await this.collection.deleteOne({
            group,
            id,
        });

        return deletedDocument.deletedCount > 0;
    }

    async getInstancesInGroup(group: string): Promise<InstanceSchema[] | null> {
        const instances = await this.collection
            .find({
                group,
            })
            .toArray();

        if (instances.length === 0) {
            return null;
        }

        return instances.map(instance => ({
            id: instance.id,
            group: instance.group,
            createdAt: instance.createdAt.getTime(),
            updatedAt: instance.updatedAt.getTime(),
            meta: instance.meta,
        }));
    }

}
