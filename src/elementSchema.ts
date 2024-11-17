import { z } from "zod";
export const textSchema = z.object({
    type: z.literal("text"),
    text: z.string(),
    x: z.number(),
    y: z.number(),
    font: z.string().optional(),
});

export const rectangleSchema = z.object({
    type: z.literal("rectangle"),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    strokeStyle: z.string().optional(),
    fillStyle: z.string().optional(),
});

export const circleSchema = z.object({
    type: z.literal("circle"),
    x: z.number(),
    y: z.number(),
    radius: z.number(),
    strokeStyle: z.string().optional(),
    fillStyle: z.string().optional(),
});

export const elementsSchema = z.discriminatedUnion("type", [
    textSchema,
    rectangleSchema,
    circleSchema,
]);