import { MongoDb } from "@ubio/framework/modules/mongodb";
import { dep } from "mesh-ioc";

export class InstanceRepository {
    @dep() private mongodb!: MongoDb;

    protected get collection() {
        return this.mongodb.db.collection('instances');
    }
}