import { Address } from "./Address";

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
}
