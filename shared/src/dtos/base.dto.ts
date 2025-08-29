import { z } from "zod";
import { s } from "../safeZod";

export const BaseIdSchema = s.object({
  id: s.id(),
});

export const BasePaginationSchema = s.object({
  page: s.number(),
  limit: s.number().max(1000),
});

export const BaseDateRangeSchema = s.object({
  startDate: s.date().optional(),
  endDate: s.date().optional(),
});

export const BaseSuccessResponseSchema = s.object({
  success: s.boolean().default(true),
});

export const BaseIdResponseSchema = s.object({
  id: s.id(),
});

export const BasePaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  s.object({
    data: s.array(dataSchema),
    total: s.number(),
  });
