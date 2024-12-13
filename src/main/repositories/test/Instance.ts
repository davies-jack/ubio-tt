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
}
