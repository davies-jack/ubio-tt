import { Get, Router } from "@ubio/framework";

export class InstanceRouter extends Router {
    @Get({
        path: '/',
        summary: 'instance route',
    })
    async getInstances() {
        return '!'
    }
}