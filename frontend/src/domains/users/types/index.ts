import { s } from "@shared/safeZod";
import {
  SchemaAddress,
  SchemaUserForm,
  SchemaUsersFilterForm,
} from "../schemas";

export interface DisableUser {
  userName: string;
  userId: string;
}

export type UsersFilterFormInputs = s.infer<typeof SchemaUsersFilterForm>;

export type UserFormInputs = s.infer<typeof SchemaUserForm>;

export type AddressFormInputs = s.infer<typeof SchemaAddress>;
