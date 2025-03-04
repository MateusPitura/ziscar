import { s } from "@shared/safeZod";

export const SchemaUsersFilterForm = s.object({
  fullName: s.string().or(s.empty()),
  orderBy: s.list(["fullName", "email"]),
  status: s.list(["active", "inactive"]),
});

export const SchemaUserForm = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cellphone: s.cellphone(),
  cpf: s.cpf(),
  code: s.string().or(s.empty()),
  birthDate: s.birthDate(),
  category: s.string(),
  address: s.SchemaAddressEmpty,
});
