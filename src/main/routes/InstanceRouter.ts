import { BodyParam, Delete, Get, PathParam, Post, Router } from "@ubio/framework";
import { dep } from "mesh-ioc";
import { InstanceRepository } from "../repositories/Instance.js";

export class InstanceRouter extends Router {
    @dep() private instanceRepository!: InstanceRepository;

    @Get({
        path: '/',
        summary: 'Fetches all groups',
    })
    async getInstances() {
        return await this.instanceRepository.getAllGroups();
    }

    @Post({
        path: '/{group}/{id}',
        summary: 'Registers an instance',
        responses: {
            201:  {
                description: 'Instance registered',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        group: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                        meta: { type: 'object' },
                    },
                },
            }
        }
    })
    async registerInstance(
        @PathParam('group', {
            schema: {
                type: 'string',
            }
        }) group: string,
        @PathParam('id', {
            schema: {
                type: 'string',
            }
        }) id: string,
        @BodyParam('meta', {
            schema: {
                type: 'object',
            }
        }) meta?: any,
    ) {
        const instance = await this.instanceRepository.registerInstance(group, id, meta);
        if (instance === null) {
            this.ctx.status = 400;
            return;
        }

        if (instance.updatedAt === instance.createdAt) {
            this.ctx.status = 201;
        }
        
        return instance;
    }

    @Delete({
        path: '/{group}/{id}',
        summary: 'Deletes an instance',
    })
    async deleteInstance(
        @PathParam('group', {
            schema: {
                type: 'string',
            }
        }) group: string,
        @PathParam('id', {
            schema: {
                type: 'string',
            }
        }) id: string,
    ) {
        const hasJustBeenDeleted = await this.instanceRepository.deleteInstance(group, id);
        this.ctx.status = hasJustBeenDeleted ? 200 : 404;
    }

    @Get({
        path: '/{group}',
        summary: 'Fetches all instances in a group',
    })
    async getInstancesInGroup(
        @PathParam('group', {
            schema: {
                type: 'string',
            }
        }) group: string,
    ) {
        return await this.instanceRepository.getInstancesInGroup(group);
    }
}