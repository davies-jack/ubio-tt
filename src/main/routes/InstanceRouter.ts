import { BodyParam, Get, PathParam, Post, Router } from "@ubio/framework";
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
        return await this.instanceRepository.registerInstance(group, id, meta);
    }
}