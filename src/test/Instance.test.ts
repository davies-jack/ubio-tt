import { assert, expect } from 'chai';
import { randomUUID } from 'crypto';
import supertest from 'supertest';

import { App } from '../main/app.js';
import { InstanceSchema } from '../main/schemas/InstanceSchema.js';
import { TestInstanceRepository } from './repositories/Instance.js';

describe('Instance Router', () => {
    const app = new App();
    app.mesh.service(TestInstanceRepository);

    const testInstanceRepository = app.mesh.resolve(TestInstanceRepository);
    const randomId = randomUUID();

    beforeEach(async () => {
        await app.start();
    });
    afterEach(async () => {
        try {
            await testInstanceRepository.wipeDatabase();
        } finally {
            await app.stop();
        }
    });

    describe('GET /', () => {
        it('200 - should return 200 when fetching all instances', async () => {
            await testInstanceRepository.createInstances();

            const request = supertest(app.httpServer.callback());
            const { status, body } = await request.get('/');

            expect(status).to.be.equal(200);
            expect(body).to.be.an('array');
            expect(body.length).to.be.equal(2);

            expect(body[0].group).to.be.equal('particle-accelerator');
            expect(body[1].group).to.be.equal('spaceship-os');

            expect(body[0].instances).to.equal(8);
            expect(body[1].instances).to.equal(1);

            assert.isDefined(body[0].createdAt);
            assert.isDefined(body[1].createdAt);

            assert.isDefined(body[0].updatedAt);
            assert.isDefined(body[1].updatedAt);

            assert.isUndefined(body.error);
        });

        it('404 - should return 404 when no groups are found', async () => {
            const request = supertest(app.httpServer.callback());
            const { status, body } = await request.get('/');
            expect(status).to.be.equal(404);
            expect(body.error).to.be.equal('No groups found');
        });
    });

    describe('POST /{group}/{id}', () => {
        it('201 - should return 201 when registering an instance', async () => {
            const request = supertest(app.httpServer.callback());
            const { status, body } = await request
                .post(`/particle-accelerator/${randomId}`)
                .send({
                    meta: {
                        location: 'NL',
                    },
                });

            expect(status).to.be.equal(201);
            expect(body).to.be.an('object');
            expect(body.group).to.be.equal('particle-accelerator');
            expect(body.id).to.be.equal(randomId);
            expect(body.meta.location).to.be.equal('NL');
            assert.isDefined(body.createdAt);
            assert.isDefined(body.updatedAt);
        });

        it('400 - should return 400 when registering an instance with no meta', async () => {
            const request = supertest(app.httpServer.callback());
            const { status } = await request.post(`/particle-accelerator/${randomId}`);
            expect(status).to.be.equal(400);
        });

        it('200 - should return 200 if the instance already exists and update updatedAt', async () => {
            const request = supertest(app.httpServer.callback());

            const { status: createStatus, body: createBody } = await request
                .post(`/particle-accelerator/${randomId}`)
                .send({
                    meta: {
                        location: 'NL',
                    },
                });
            expect(createStatus).to.be.equal(201);

            const { status: updateStatus, body: updateBody } = await request
                .post(`/particle-accelerator/${randomId}`)
                .send({
                    meta: {
                        location: 'NL',
                    },
                });
            expect(updateStatus).to.be.equal(200);
            expect(updateBody.updatedAt).to.be.greaterThan(createBody.updatedAt);
        });

        it('200 - should return 200 if the instance already exists and update meta', async () => {
            const request = supertest(app.httpServer.callback());
            await testInstanceRepository.createInstances();

            const { status: updateStatus, body: updateBody } = await request
                .post(`/particle-accelerator/125`)
                .send({
                    meta: {
                        location: 'UK',
                        more: 'data',
                    },
                });
            expect(updateStatus).to.be.equal(200);
            expect(updateBody.meta.location).to.be.equal('UK');
            expect(updateBody.meta.more).to.be.equal('data');
        });
    });

    describe('DELETE /{group}/{id}', () => {
        it('200 - should return 200 when deleting an existing instance', async () => {
            const request = supertest(app.httpServer.callback());

            const { status: createStatus } = await request
                .post(`/particle-accelerator/${randomId}`)
                .send({
                    meta: {
                        location: 'NL',
                    },
                });
            expect(createStatus).to.be.equal(201);

            const { status: deleteStatus, body: deleteBody } = await request.delete(
                `/particle-accelerator/${randomId}`,
            );
            expect(deleteStatus).to.be.equal(200);
            expect(deleteBody.message).to.be.equal('Instance deleted');
            assert.isUndefined(deleteBody.error);
        });

        it('404 - should return 404 if the instance does not exist', async () => {
            const request = supertest(app.httpServer.callback());
            const { status, body } = await request.delete(`/particle-accelerator/${randomId}`);
            expect(status).to.be.equal(404);
            expect(body.error).to.be.equal('Instance not found');
        });
    });

    describe('GET /{group}', () => {
        it('200 - should return 200 when fetching all instances in a group', async () => {
            const request = supertest(app.httpServer.callback());
            await testInstanceRepository.createInstances();

            const { status, body } = await request.get('/particle-accelerator');

            expect(status).to.be.equal(200);
            expect(body).to.be.an('array');
            expect(body.length).to.be.equal(8);

            assert(
                body.every(
                    (instance: InstanceSchema) => instance.group === 'particle-accelerator',
                ),
            );
            expect(body[0].id).to.equal('123');
            expect(body[0].meta.location).to.equal('NL');
            assert.isUndefined(body.error);
            assert.isDefined(body[0].createdAt);
            assert.isDefined(body[0].updatedAt);
        });

        it('404 - should return 404 if no instances are found', async () => {
            const request = supertest(app.httpServer.callback());
            const { status, body } = await request.get('/particle-accelerator');
            expect(status).to.be.equal(404);
            expect(body.error).to.be.equal('No instances found');
        });
    });
});
