import { SchemaAddress } from "@/domains/global/schemas";
import { s } from "@shared/safeZod";

export const SchemaCustomersFilterForm = s
  .object({
    fullName: s.name().or(s.empty()),
    status: s.enumeration(["active", "inactive"]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaCustomerForm = s.object({
  fullName: s.fullName(),
  email: s.email().or(s.empty()),
  phone: s.phone().or(s.empty()),
  cpf: s.cpf(),
  address: s.array(SchemaAddress).max(1),
});
