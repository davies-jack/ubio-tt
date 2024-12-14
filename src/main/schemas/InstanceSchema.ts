import { Schema } from "@ubio/framework";

export interface InstanceSchema {
  id: string;
  group: string;
  createdAt: number;
  updatedAt: number;

  meta?: {
    [key: string]: any;
  };
}

export const InstanceSchema = new Schema<InstanceSchema>({
  schema: {
    type: "object",
    properties: {
      id: { type: "string" },
      group: { type: "string" },
      createdAt: { type: "number" },
      updatedAt: { type: "number" },
      meta: {
        type: "object",
        optional: true,
        properties: {},
        additionalProperties: true,
      },
    },
    required: ["id", "group", "createdAt", "updatedAt"],
  },
});
