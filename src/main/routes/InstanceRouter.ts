import { BodyParam, Delete, Get, PathParam, Post, Router } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { InstanceRepository } from '../repositories/Instance.js';

export class InstanceRouter extends Router {

    @dep() private instanceRepository!: InstanceRepository;

    @Get({
        path: '/',
        summary: 'Fetches all groups in the database and their instances.',
        responses: {
            200: {
                description: 'An array of objects, each containing information about a group.',
                schema: {
                    type: 'array',
                    properties: {
                        group: { type: 'string' },
                        instances: { type: 'number' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                    required: ['group', 'instances', 'createdAt', 'updatedAt'],
                },
            },
        },
    })
    async getInstances() {
        return await this.instanceRepository.getAllGroups();
    }

    @Post({
        path: '/{group}/{id}',
        summary: 'Registers a new instance, or updates the hearbeat on an existing one.',
        responses: {
            200: {
                description: 'Instance heartbeat has been updated',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        group: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                        meta: { type: 'object' },
                    },
                    required: ['id', 'group', 'createdAt', 'updatedAt'],
                },
            },
            201: {
                description: 'New instance has been registered',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        group: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                        meta: { type: 'object' },
                    },
                    required: ['id', 'group', 'createdAt', 'updatedAt'],
                },
            },
            400: {
                description: 'Instance could not be registered due to an error',
            },
        },
    })
    async registerInstance(
        @PathParam('group', {
            schema: {
                type: 'string',
            },
        })
        group: string,
        @PathParam('id', {
            schema: {
                type: 'string',
            },
        })
        id: string,
        @BodyParam('meta', {
            schema: {
                type: 'object',
            },
        })
        meta?: any,
    ) {
        const instance = await this.instanceRepository.registerInstance(group, id, meta);
        if (instance == null) {
            this.ctx.status = 400;
            return;
        }

        this.ctx.status = instance.updatedAt === instance.createdAt ? 201 : 200;

        return instance;
    }

    @Delete({
        path: '/{group}/{id}',
        summary: 'Deletes an instance',
        responses: {
            200: {
                description: 'Instance deleted',
            },
            404: {
                description: 'Instance not found',
            },
        },
    })
    async deleteInstance(
        @PathParam('group', {
            schema: {
                type: 'string',
            },
        })
        group: string,
        @PathParam('id', {
            schema: {
                type: 'string',
            },
        })
        id: string,
    ) {
        const hasJustBeenDeleted = await this.instanceRepository.deleteInstance(group, id);
        this.ctx.status = hasJustBeenDeleted ? 200 : 404;
    }

    @Get({
        path: '/{group}',
        summary: 'Fetches all instances in a group',
        responses: {
            200: {
                description: 'An array of objects, each containing information about an instance.',
                schema: {
                    type: 'array',
                    properties: {
                        id: { type: 'string' },
                        group: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                        meta: { type: 'object' },
                    },
                },
            },
        },
    })
    async getInstancesInGroup(
        @PathParam('group', {
            schema: {
                type: 'string',
            },
        })
        group: string,
    ) {
        return await this.instanceRepository.getInstancesInGroup(group);
    }

}
