"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateErrandParamsSchema = exports.updateErrandSchema = exports.createErrandBodyTransform = exports.createErrandSchema = exports.locationSchema = void 0;
const zod_1 = require("zod");
exports.locationSchema = zod_1.z.object({
    pickup: zod_1.z.string().min(1),
    dropoff: zod_1.z.string().min(1),
});
exports.createErrandSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    pickupLocation: zod_1.z.string().optional(),
    dropoffLocation: zod_1.z.string().optional(),
    amount: zod_1.z.number().nonnegative().nullable().optional(),
});
exports.createErrandBodyTransform = exports.createErrandSchema.transform((val) => ({
    title: val.title,
    description: val.description,
    price: val.amount ?? null,
    location: val.pickupLocation || val.dropoffLocation
        ? {
            pickup: val.pickupLocation ?? null,
            dropoff: val.dropoffLocation ?? null,
        }
        : null,
}));
exports.updateErrandSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().nonnegative().optional(),
    status: zod_1.z
        .enum(["pending", "accepted", "in_progress", "completed", "cancelled"])
        .optional(),
    location: exports.locationSchema.optional(),
});
exports.updateErrandParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
