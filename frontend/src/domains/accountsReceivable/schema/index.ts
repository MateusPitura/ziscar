import { s } from "@shared/safeZod";

export const SchemaAccountsReceivableFilterForm = s
  .object({
    overallStatus: s.radio(["PAID", "PENDING"]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);