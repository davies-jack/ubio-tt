import { Get, Router } from "@ubio/framework";
import { dep } from "mesh-ioc";
import { InstanceRepository } from "../repositories/Instance.js";

export class InstanceRouter extends Router {
    @dep() private instanceRepository!: InstanceRepository;

    @Get({
        path: '/',
        summary: 'instance route',
    })
    async getInstances() {
        return this.instanceRepository.getAllGroups();
    }
}