import { Schema } from '@ubio/framework';

export interface InstanceSchema {
    id: string;
    group: string;
    createdAt: number;
    updatedAt: number;

    meta?: Record<string, any>;
}
export interface GroupSchema {
    group: string;
    instances: number;
    createdAt: number;
    updatedAt: number;
}

export const InstanceSchema = new Schema<InstanceSchema>({
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            group: { type: 'string' },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' },
            meta: {
                type: 'object',
                optional: true,
                properties: {},
                additionalProperties: true,
            },
        },
    },
});

export const InstanceSchemaArray = new Schema<InstanceSchema[]>({
    schema: {
        type: 'array',
        items: InstanceSchema.schema,
    },
});

export const GroupSchema = new Schema<GroupSchema>({
    schema: {
        type: 'object',
        properties: {
            group: { type: 'string' },
            instances: { type: 'number' },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' },
        },
    },
});

export const GroupSchemaArray = new Schema<GroupSchema[]>({
    schema: {
        type: 'array',
        items: GroupSchema.schema,
    },
});
