import { SEED_ROLE_ADMIN_ID, SEED_ROLE_SALES_ID } from "@shared/constants";
import { s } from "@shared/safeZod";

export const SchemaAddress = s.SchemaAddress.extend({
  street: s.string().or(s.empty()),
  neighborhood: s.string().or(s.empty()),
  city: s.string().or(s.empty()),
  state: s.string().or(s.empty()),
  complement: s.string().or(s.empty()),
});

export const SchemaUsersFilterForm = s.object({
  fullName: s.fullName().or(s.empty()),
  orderBy: s.radio(["fullName", "email"]),
  status: s.radio(["active", "inactive"]),
});

export const SchemaUserForm = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cellPhone: s.cellphone().or(s.empty()),
  cpf: s.cpf().or(s.empty()),
  code: s.string().or(s.empty()),
  birthDate: s.birthDate().or(s.empty()),
  roleId: s.radio([String(SEED_ROLE_ADMIN_ID), String(SEED_ROLE_SALES_ID)]).optional(),
  address: SchemaAddress.nullable(),
});
