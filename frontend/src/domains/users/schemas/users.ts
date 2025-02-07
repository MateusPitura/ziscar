import { s } from "@/domains/global/schemas";
import { removeMask } from "@/domains/global/utils/removeMask";

export const SchemaUsersFilterForm = s.object({
  fullName: s.string('default', 'optional'),
  orderBy: s.string('default', 'optional'),
  category: s.string('default', 'optional').array(),
});

export type UsersFilterFormInputs = s.infer<typeof SchemaUsersFilterForm>;

export const SchemUserForm = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cellphone: s
    .cellphone()
    .transform((cellhpone) => removeMask(cellhpone, "CELLPHONE")),
  cpf: s.cpf().transform((cpf) => removeMask(cpf, "CPF")),
  code: s.string("default", "optional"),
  birthDate: s.birthDate(),
  category: s.string(),
  address: s.addressSchema().extend({
    cep: s.cep().transform((cep) => removeMask(cep, "CEP")),
  }),
});

export type UserFormInputs = Omit<s.infer<typeof SchemUserForm>, "birthDate"> & {
  birthDate: string;
};