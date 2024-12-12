import { Application } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';

import { dep, Mesh } from 'mesh-ioc';
import { InstanceRouter } from './routes/InstanceRouter.js';

export class App extends Application {
    @dep() private mongodb!: MongoDb;

    constructor() {
        super();
        this.mesh.service(MongoDb);
    }

    override createGlobalScope() : Mesh {
        const mesh = super.createGlobalScope();
        return mesh;
    }
    override createHttpRequestScope(): Mesh {
        const mesh = super.createHttpRequestScope();
        mesh.service(InstanceRouter);
        return mesh;
    }

    override async beforeStart() : Promise<void> {
        this.logger.info('Starting application');
        await this.mongodb.start();
        await this.httpServer.startServer();
    }
    override async afterStop() : Promise<void> {
        this.logger.info('Stopping application');
        await this.mongodb.stop();
        await this.httpServer.stopServer();
    }
}