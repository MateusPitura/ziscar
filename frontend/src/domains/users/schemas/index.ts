import { s } from "@/domains/global/schemas";
import { removeMask } from "@/domains/global/utils/removeMask";

export const SchemaUsersFilterForm = s.object({
  fullName: s.string("default", "optional"),
  orderBy: s.string("default", "optional"),
  category: s.string("default", "optional").array(),
});

export const SchemaUserForm = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cellphone: s
    .cellphone()
    .transform((cellhpone) => removeMask(cellhpone, "cellphone")),
  cpf: s.cpf().transform((cpf) => removeMask(cpf, "cpf")),
  code: s.string("default", "optional"),
  birthDate: s.birthDate(),
  category: s.string(),
  address: s.SchemaAddress.extend({
    cep: s.cep().transform((cep) => removeMask(cep, "cep")),
  }),
});
