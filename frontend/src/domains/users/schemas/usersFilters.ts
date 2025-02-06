import { s } from "@/domains/global/schemas";

export const SchemaUsersFilterForm = s.object({
  fullName: s.string('default', 'optional'),
  orderBy: s.string('default', 'optional'),
  category: s.string('default', 'optional').array(),
});

export type UsersFilterFormInputs = s.infer<typeof SchemaUsersFilterForm>;
