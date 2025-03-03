import { s } from "@shared/safeZod";
import { SchemaUserForm, SchemaUsersFilterForm } from "../schemas";

export interface DisableUser {
  userName: string;
  userId: string;
}

export type UsersFilterFormInputs = s.infer<typeof SchemaUsersFilterForm>;

export type UserFormInputs = Omit<
  s.infer<typeof SchemaUserForm>,
  "birthDate"
> & {
  birthDate: string;
};
