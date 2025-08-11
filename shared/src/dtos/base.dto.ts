import { z } from "zod";
import { s } from "../safeZod";

export const BaseIdSchema = s.object({
  id: s.id(),
});

export const BasePaginationSchema = s.object({
  page: s.number().min(0).optional().default(0),
  limit: s.number().min(1).max(100).optional().default(20),
});

export const BaseDateRangeSchema = s.object({
  startDate: s.date().optional(),
  endDate: s.date().optional(),
});

export const BaseSuccessResponseSchema = s.object({
  success: s.boolean().default(true),
});

export const BaseIdResponseSchema = BaseIdSchema;

export const BasePaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  s.object({
    data: s.array(dataSchema),
    totalCount: s.number(),
  });
