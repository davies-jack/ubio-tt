import { MongoDb } from "@ubio/framework/modules/mongodb";
import { dep } from "mesh-ioc";

export class InstanceRepository {
    @dep() private mongodb!: MongoDb;

    protected get collection() {
        return this.mongodb.db.collection('instances');
    }

    async getAllGroups() : Promise<{ group: string, instances: number, createdAt: number, updatedAt: number }[]> {
        const groups = await this.collection.aggregate([
            { $group: { _id: '$group', instances: { $sum: 1 }, createdAt: { $min: '$createdAt' }, updatedAt: { $max: '$updatedAt' } } },
            { $project: { _id: 0, group: '$_id', instances: 1, createdAt: 1, updatedAt: 1 } },
        ]).toArray();

        return groups.map((group) => ({
            id: group.id,
            group: group.group,
            instances: group.instances,
            createdAt: group.createdAt.getTime(),
            updatedAt: group.updatedAt.getTime(),
        }));
    }
}