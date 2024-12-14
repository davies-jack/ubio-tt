import supertest from "supertest";
import { expect } from "chai";
import { App } from "../main/app.js";
import { TestInstanceRepository } from "../main/repositories/test/Instance.js";
import { InstanceSchema } from "../main/schemas/InstanceSchema.js";

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
        it('200 - should return 200 when fetching all instances', async () => {
            const request = supertest(app.httpServer.callback());
            const response = await request.get('/');
            
            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    describe('POST /{group}/{id}', () => {
        it('201 - should return 201 when registering an instance', async () => {
            const request = supertest(app.httpServer.callback());
            const response = await request.post('/particle-accelerator/123').send({
                meta: {
                    location: 'NL',
                }
            });

            expect(response.status).to.be.equal(201);
            expect(response.body).to.be.an('object');
            expect(response.body.group).to.be.equal('particle-accelerator');
            expect(response.body.id).to.be.equal('123');
        });

        it('200 - should return 200 if the instance already exists and update updatedAt', async () => {
            const request = supertest(app.httpServer.callback());

            const { status: createStatus, body: createBody } = await request.post('/particle-accelerator/123')
            .send({
                meta: {
                    location: 'NL',
                }
            });
            expect(createStatus).to.be.equal(201);

            const { status: updateStatus, body: updateBody } = await request.post('/particle-accelerator/123')
            .send({
                meta: {
                    location: 'NL',
                }
            });
            expect(updateStatus).to.be.equal(200);
            expect(updateBody.updatedAt).to.be.greaterThan(createBody.updatedAt);
        });
    });

    describe('DELETE /{group}/{id}', () => {
        it('200 - should return 200 when deleting an existing instance', async () => {
            const request = supertest(app.httpServer.callback());

            const { status: createStatus } = await request.post('/particle-accelerator/123')
            .send({
                meta: {
                    location: 'NL',
                }
            });
            expect(createStatus).to.be.equal(201);

            const { status: deleteStatus } = await request.delete('/particle-accelerator/123');
            expect(deleteStatus).to.be.equal(200);
        });

        it('404 - should return 404 if the instance does not exist', async () => {
            const request = supertest(app.httpServer.callback());
            const response = await request.delete('/particle-accelerator/does-not-exist');
            expect(response.status).to.be.equal(404);
        });
    });

    describe('GET /{group}', () => {
        it('200 - should return 200 when fetching all instances in a group', async () => {
            const createRequests = {
                '/particle-accelerator/123': {
                    meta: {
                        location: 'NL',
                    }
                },
                '/particle-accelerator/124': {
                    meta: {
                        location: 'NL',
                    }
                },
                '/particle-accelerator/125': {
                    meta: {
                        location: 'NL',
                    }
                },
            };

            for (const [path, body] of Object.entries(createRequests)) {
                const request = supertest(app.httpServer.callback());
                const response = await request.post(path).send(body);
                expect(response.status).to.be.equal(201);
            }

            const request = supertest(app.httpServer.callback());
            const response = await request.get('/particle-accelerator');

            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.equal(3);
            expect(response.body.every((instance: InstanceSchema) => instance.group === 'particle-accelerator')).to.be.true;
        });
    });
});