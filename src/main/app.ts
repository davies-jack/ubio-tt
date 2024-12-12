import { Application } from '@ubio/framework';
import { Mesh } from 'mesh-ioc';

export class App extends Application {
    override createGlobalScope() : Mesh {
        const mesh = super.createGlobalScope();
        return mesh;
    }
    override createHttpRequestScope(): Mesh {
        const mesh = super.createHttpRequestScope();
        return mesh;
    }

    override async beforeStart() : Promise<void> {
        this.logger.info('Starting application');
        await this.httpServer.startServer();
    }
    override async afterStop() : Promise<void> {
        this.logger.info('Stopping application');
        await this.httpServer.stopServer();
    }
}