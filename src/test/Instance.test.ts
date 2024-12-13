import supertest from "supertest";
import { expect } from "chai";
import { App } from "../main/app.js";
import { TestInstanceRepository } from "../main/repositories/test/Instance.js";

describe('Instance Router', () => {
    const app = new App();
    app.mesh.service(TestInstanceRepository);

    const testInstanceRepository = app.mesh.resolve(TestInstanceRepository);

    beforeEach(async () => {
        await app.start();
    });
    afterEach(async () => {
        await testInstanceRepository.wipeDatabase();
        await app.stop();
    });

    describe('GET /', () => {
        it('200 - should return all instances', async () => {
            const request = supertest(app.httpServer.callback());
            const response = await request.get('/');
            
            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.an('array');
        });
    });
});