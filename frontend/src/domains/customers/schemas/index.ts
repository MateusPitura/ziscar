import { SchemaAddress } from "@/domains/global/schemas";
import { s } from "@shared/safeZod";

export const SchemaCustomersFilterForm = s
  .object({
    fullName: s.string().or(s.empty()),
    orderBy: s.radio(["fullName", "email"]),
    status: s.radio(["active", "inactive"]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaCustomerForm = s.object({
  fullName: s.string(),
  email: s.email().or(s.empty()),
  phone: s.phone().or(s.empty()),
  cpf: s.cpf(),
  address: s.array(SchemaAddress).max(1),
});
