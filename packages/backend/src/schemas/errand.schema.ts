// src/schemas/errand.schema.ts
import { z } from "zod";

export const locationSchema = z.object({
  pickup: z.string().min(1),
  dropoff: z.string().min(1),
});

export const createErrandSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  amount: z.number().nonnegative().nullable().optional(),
});

export const createErrandBodyTransform = createErrandSchema.transform(
  (val) => ({
    title: val.title,
    description: val.description,
    price: val.amount ?? null,
    location:
      val.pickupLocation || val.dropoffLocation
        ? {
            pickup: val.pickupLocation ?? null,
            dropoff: val.dropoffLocation ?? null,
          }
        : null,
  })
);

export const updateErrandSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  status: z
    .enum(["pending", "accepted", "in_progress", "completed", "cancelled"])
    .optional(),
  location: locationSchema.optional(),
});
