import { BodyParam, Delete, Get, PathParam, Post, Router } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { InstanceRepository } from '../repositories/Instance.js';
import { GroupSchemaArray, InstanceSchema, InstanceSchemaArray } from '../schemas/InstanceSchema.js';

export class InstanceRouter extends Router {

    @dep() private instanceRepository!: InstanceRepository;

    @Get({
        path: '/',
        summary: 'Fetches all groups in the database and their instances.',
        responses: {
            200: {
                description: 'An array of objects, each containing information about a group.',
                schema: GroupSchemaArray,
            },
        },
    })
    async getInstances() {
        const groups = await this.instanceRepository.getAllGroups();
        if (groups == null) {
            this.ctx.status = 404;
            this.ctx.body = {
                error: 'No groups found',
            };
            return;
        }

        return groups;
    }

    @Post({
        path: '/{group}/{id}',
        summary: 'Registers a new instance, or updates the hearbeat on an existing one.',
        responses: {
            200: {
                description: 'Instance heartbeat has been updated',
                schema: InstanceSchema,
            },
            201: {
                description: 'New instance has been registered',
                schema: InstanceSchema,
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
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
            404: {
                description: 'Instance not found',
                schema: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
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
        if (!hasJustBeenDeleted) {
            this.ctx.status = 404;
            this.ctx.body = {
                error: 'Instance not found',
            };
            return;
        }

        this.ctx.status = 200;
        this.ctx.body = {
            message: 'Instance deleted',
        };
    }

    @Get({
        path: '/{group}',
        summary: 'Fetches all instances in a group',
        responses: {
            200: {
                description: 'An array of objects, each containing information about an instance.',
                schema: InstanceSchemaArray,
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
