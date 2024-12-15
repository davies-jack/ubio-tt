import { MongoDb } from "@ubio/framework/modules/mongodb";
import { dep } from "mesh-ioc";

export class TestInstanceRepository {
  @dep() private mongodb!: MongoDb;

  protected get collection() {
    return this.mongodb.db.collection('instances');
  }

  async wipeDatabase() {
    if (process.env.NODE_ENV === "test") {
      await this.collection.deleteMany({});
    }
  }

  async createInstances() {
    if (process.env.NODE_ENV === "test") {
      await this.collection.insertMany([
        { group: 'particle-accelerator', id: '123', meta: { location: 'NL' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'particle-accelerator', id: '124', meta: { location: 'UK' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'particle-accelerator', id: '125', meta: { location: 'US' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'particle-accelerator', id: '126', meta: { location: 'DE' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'particle-accelerator', id: '127', meta: { location: 'FR' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'particle-accelerator', id: '128', meta: { location: 'ES' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'particle-accelerator', id: '129', meta: { location: 'IT' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'particle-accelerator', id: '130', meta: { location: 'BE' }, createdAt: new Date(), updatedAt: new Date() },
        { group: 'spaceship-os', id: '131', meta: { location: 'NL' }, createdAt: new Date(), updatedAt: new Date() },
      ]);
  }
  }
}
