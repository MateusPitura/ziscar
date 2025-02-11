import { Address } from "./address";

export type UserLogged = Pick<User, "id" | "permissions">;

export type Resource = "users";

export type Action = "create" | "read" | "update" | "delete";

export interface User {
  id: string;
  fullName: string;
  email: string;
  cellphone?: string;
  cpf?: string;
  code?: string;
  birthDate?: string;
  address?: Address;
  isActive?: boolean;
  category?: "admin" | "finance" | "seller";
  permissions: Record<Resource, Record<Action, boolean>>;
}
