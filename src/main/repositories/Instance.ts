import { MongoDb } from "@ubio/framework/modules/mongodb";
import { dep } from "mesh-ioc";
import { InstanceSchema } from "../schemas/InstanceSchema.js";
import { config } from "@ubio/framework";

export class InstanceRepository {
  @dep() private mongodb!: MongoDb;
  @config({
    default: 7200
  }) private EXPIRY_TIME_IN_SECONDS!: number;

  protected get collection() {
    return this.mongodb.db.collection("instances");
  }

  async AutoDeleteIndex() {
    await this.collection.createIndex({
      updatedAt: 1
    }, {
      expireAfterSeconds: this.EXPIRY_TIME_IN_SECONDS
    });
  }


  async getAllGroups(): Promise<
    { group: string; instances: number; createdAt: number; updatedAt: number }[]
  > {
    const groups = await this.collection
      .aggregate([
        {
          $group: {
            _id: "$group",
            instances: { $sum: 1 },
            createdAt: { $min: "$createdAt" },
            updatedAt: { $max: "$updatedAt" },
          },
        },
        {
          $project: {
            _id: 0,
            group: "$_id",
            instances: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .toArray();

    return groups.map((group) => ({
      id: group.id,
      group: group.group,
      instances: group.instances,
      createdAt: group.createdAt.getTime(),
      updatedAt: group.updatedAt.getTime(),
    }));
  }

  async registerInstance(group: string, id: string, meta?: any): Promise<InstanceSchema | null> {
    const instance = await this.collection.findOneAndUpdate(
      {
        group,
        id,
      },
      {
        $set: {
          updatedAt: new Date(),
        },
        $setOnInsert: {
          id,
          group,
          createdAt: new Date(),
          meta,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        projection: {
          _id: false,
        },
      }
    );

    if (!instance) {
      return null;
    }

    return {
        id: instance.id,
        group: instance.group,
        createdAt: instance.createdAt.getTime(),
        updatedAt: instance.updatedAt.getTime(),
        meta: instance.meta,
    }
  }

  async deleteInstance(group: string, id: string) {
    const deletedDocument = await this.collection.deleteOne({
      group,
      id,
    });

    return deletedDocument.deletedCount > 0;
  }

  async getInstancesInGroup(group: string): Promise<InstanceSchema[]> {
    const instances = await this.collection.find({
      group,
    }).toArray();
    return instances.map((instance) => ({
      id: instance.id,
      group: instance.group,
      createdAt: instance.createdAt.getTime(),
      updatedAt: instance.updatedAt.getTime(),
      meta: instance.meta,
    }));
  }
}

