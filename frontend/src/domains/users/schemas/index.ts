import { SchemaAddress } from "@/domains/global/schemas";
import { SEED_ROLE_ADMIN_ID, SEED_ROLE_SALES_ID } from "@shared/constants";
import { s } from "@shared/safeZod";

export const SchemaUsersFilterForm = s.object({
  fullName: s.fullName().or(s.empty()),
  orderBy: s.radio(["fullName", "email"]),
  status: s.radio(["active", "inactive"]),
});

export const SchemaUserForm = s.object({
  fullName: s.fullName(),
  email: s.email(),
  phone: s.phone().or(s.empty()),
  cpf: s.cpf().or(s.empty()),
  roleId: s
    .radio([String(SEED_ROLE_ADMIN_ID), String(SEED_ROLE_SALES_ID)])
    .optional(),
  address: s.array(SchemaAddress).max(1),
});
