import { Address } from "./address";

export type UserLogged = Pick<User, "id">;

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
  category?: string;
}
